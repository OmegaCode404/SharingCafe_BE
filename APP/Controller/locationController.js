// const express = require('express');
import axios from 'axios';
import { json } from 'sequelize';
import * as userService from '../Service/userService.js';

// const app = express();
// const PORT = process.env.PORT || 3000;

// Endpoint to search for places by name
// app.get('/search', async (req, res) => {
//   try {
//     const { name } = req.query;
//     const apiKey = 'KnB6OOmQcQpYSTnqzYhjqUmcGSBKUob1cDF9oOPw';
//     const response = await axios.get(`https://rsapi.goong.io/Place/Autocomplete?key=${apiKey}&input=${name}`);
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const apiKey = 'KnB6OOmQcQpYSTnqzYhjqUmcGSBKUob1cDF9oOPw';

// pages/api/getCurrentLocation.js

export async function updateCurrentLocation(req, res) {
  //sửa thành phương thức update
  if (req.method === 'PUT') {
    const { userId, lat, lng } = req.query;
    // Thực hiện xử lý với dữ liệu vị trí ở đây
    console.log('Received location data - Latitude:', lat, 'Longitude:', lng);
    // update location
    const [affectedCount, affectedRows] = await userService.updateLocation(
      userId,
      lat,
      lng,
    );
    console.log(affectedCount);
    if (affectedCount > 0) {
      // Phản hồi với dữ liệu đã nhận được
      res.status(200).json({ message: 'Location data received successfully' });
    } else {
      // return error
      res.status(500).json({ error: 'Failed to update location' });
    }
  } else {
    // Nếu không phải là phương thức PUT, trả về lỗi "Method Not Allowed"
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function getDistance(req, res) {
  // sửa thành db
// Hàm tính tọa độ điểm ở giữa của một khoảng cách trên mặt cầu
function tinhDiemGiuaCuaKhoangCach(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371;

  const radLat1 = toRadians(lat1);
  const radLon1 = toRadians(lon1);
  const radLat2 = toRadians(lat2);
  const radLon2 = toRadians(lon2);

  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  const latMiddle = (lat1 + lat2) / 2;
  const lngMiddle = (lon1 + lon2) / 2;

  return { lat: latMiddle, lng: lngMiddle };
  }
}
export async function getMiddlePoint(req, res) {
  try {
    const userIdA = req.query.userIdA;
    const userIdB = req.query.userIdB;

    const locationA = await userService.getLocation(userIdA);
    const locationB = await userService.getLocation(userIdB);
    const originsLAT = locationA.lat;
    const originsLNG = locationA.lng;
    const destinationsLAT = locationB.lat;
    const destinationsLNG = locationB.lng;

    // Tính tọa độ trung điểm
    const lat = (parseFloat(originsLAT) + parseFloat(destinationsLAT)) / 2;
    const lng = (parseFloat(originsLNG) + parseFloat(destinationsLNG)) / 2;
    return { lat, lng }; // Trả về đối tượng chứa lat và lng
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRecommendCafe(req, res) {
  try {
    // Gọi hàm getMiddlePoint và nhận kết quả trả về
    const middlePoint = await getMiddlePoint(req, res);

    if (!middlePoint || !middlePoint.lat || !middlePoint.lng) {
      // Kiểm tra xem kết quả trả về có hợp lệ hay không
      return res
        .status(500)
        .json({ error: 'Invalid middle point coordinates' });
    }

    const { lat, lng } = middlePoint; // Sử dụng destructuring để lấy lat và lng từ kết quả trả về

    const name = req.query.name;
    let radius = 5; // Khởi tạo bán kính mặc định là 5 km
    let response;
    const keyword = req.query.keyword ?? "Highland";

    // Lặp cho đến khi nhận được kết quả hoặc đạt tới giới hạn bán kính
    while (!response && radius <= 10) {
      response = await axios.get(
        `https://rsapi.goong.io/Place/AutoComplete?input=${keyword}&location=${lat},${lng}&limit=200&radius=${radius}&api_key=KnB6OOmQcQpYSTnqzYhjqUmcGSBKUob1cDF9oOPw`,
      );
      // Nếu không nhận được kết quả, tăng radius lên 1 đơn vị km
      if (!response.data) {
        radius += 1;
      } else {
        // Nếu nhận được kết quả, gửi phản hồi và dừng vòng lặp
        return res.status(200).json(response.data);
      }
    }

    // Nếu vòng lặp kết thúc mà không có kết quả
    res
      .status(404)
      .json({ message: 'No results found within the search radius.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateLocation(req, res) {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const userId = req.query.userId;
    const result = await userService.updateLocation(userId, lat, lng);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getDistrict(req, res) {
  try {
    const provinceId = req.query.province_id;
    const result = await axios.get(
    `
      https://esgoo.net/api-tinhthanh/2/${provinceId}.htm
    `
    );
    return res.status(200).send(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProvince(req, res) {
  try {
    const result = await userService.getProvince();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}