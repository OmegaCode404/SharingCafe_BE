import { TYPE_IMAGE } from '../common/CommonEnums.js'
import { Image, SequelizeInstance } from '../utility/DbHelper.js'
import { Op } from 'sequelize'

export async function uploadMultipleImage({ items }) {
  let ref_id = items[0].ref_id
  let type = items[0].type
  let urls = items.map((item) => item.url)
  return await updateMultipleImage({ ref_id, type, urls })
}

export async function getImageFromRefIdAndType({ ref_id, type }) {
  return await Image.findAll({
    where: {
      ref_id,
      type,
    },
  })
}

export async function updateMultipleImage({ ref_id, type, urls }) {
  const update = await Image.update(
    { type: TYPE_IMAGE.DELETE },
    {
      where: {
        [Op.and]: [{ type }, { ref_id }, { url: { [Op.notIn]: urls } }],
      },
    }
  )
  const sqlQuery = `
    ${
      urls
        ? `with images as (${urls
            .map(
              (item) =>
                ` SELECT gen_random_uuid() AS image_id, '${item}'::text AS url, '${ref_id}'::uuid AS ref_id, ${type}::int AS type`
            )
            .join(' union ')})
      `
        : ''
    }
    select
      a.*
    from 
      images a
        left join image b 
          on a.ref_id = b.ref_id 
          and a.type = b.type
          and a.url = b.url
    where b.image_id is null
    `
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
  })

  if (result.length > 0) {
    await Image.bulkCreate(result)
  }
  return result
}
