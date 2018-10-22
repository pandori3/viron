const csv = require('csv');
const moment = require('moment-timezone');

const shared = require('../shared');
const context = shared.context;

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /user
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const vironlib = context.getVironLib();
  const pager = vironlib.pager;
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const IdMasters = store.models.IdMasters;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
  const options = {
    attributes,
    limit,
    offset,
  };
  const query = {};
  if (req.query.name) {
    query.name = {$like: `${req.query.name}%`};
  }
  if (req.query.sort) {
    options.order = req.query.sort.split(',').map(v => v.split(':'));
  }
  return storeHelper.list(store, IdMasters, query, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
  ;
};

/**
 * Controller : Create  User
 * HTTP Method : POST
 * PATH : /user
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const IdMasters = store.models.IdMasters;
  const user = Object.assign({}, req.body);

  return storeHelper.create(store, IdMasters, user)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete  User
 * HTTP Method : DELETE
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const IdMasters = store.models.IdMasters;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, IdMasters, query, options)
    .then(() => {
      res.status(204).end();
    })
    .catch(next)
  ;
};

/**
 * Controller : update  User
 * HTTP Method : PUT
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const IdMasters = store.models.IdMasters;
  const query = {
    id: req.swagger.params.id.value,
  };
  const user = Object.assign({}, req.body);
  return storeHelper.update(store, IdMasters, query, user)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};


/**
 * Controller : download Users
 * HTTP Method : GET
 * PATH : /user/download/csv
 *
 * @returns {Promsie.<TResult>}
 */
const download = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const IdMasters = store.models.IdMasters;
  const attributes = ['master_id', 'userrname', 'division'];
  const options = {
    attributes,
    limit: 100000000,
    offset: 0,
  };
  const query = {};
  return storeHelper.list(store, IdMasters, query, options)
    .then(data => {
      return new Promise((resolve, reject) => {
        csv.stringify(data.list, {
          columns: attributes,
          delimiter: ',',
          escape: '\\',
          eof: false,
          header: true,
          quoted: true,
          quotedEmpty: true,
          quotedString: true,
        }, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    })
    .then(data => {
      const name = `user_${moment().tz('Asia/Tokyo').format('YYYYMMDDHHmmss')}.csv`;
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
      res.send(data);
    })
    .catch(next)
  ;
};

module.exports = {
  'idmasters#list': list,
  'idmasters#create': create,
  'idmasters#remove': remove,
  'idmasters#update': update,
  'idmasters#download': download,
};
