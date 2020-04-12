var express = require('express');
var router = express.Router();
var context = require('../mongo_context')


router.get('/',
 function(req, res, next) {
  context.moduleIcons.paginateRecord({
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      callback: (result) => {
        res.send(result)
    }})
})

router.get('/:slug',
 function(req, res, next) {

  context.moduleIcons.getRecord({
      recordId: req.params.slug,
      callback: (result) => {
        res.send(result)
      }
    })
})

router.post('/',
 function(req, res, next) {
  
  context.moduleIcons.addRecord({
      record: req.body,
      callback: (result) => {
        res.send(result)
      }
    })
})

router.put('/:slug',
 function(req, res, next) {

  context.moduleIcons.editRecord({
      recordId: req.params.slug,
      record: req.body,
      callback: (result) => {
        res.send(result)
      }
    })
})

router.delete('/:slug',
 function(req, res, next) {
  
  context.moduleIcons.deleteRecord({
      recordId: req.params.slug,
      callback: (result) => {
        res.send(result)
      }
    })
})

module.exports = router;
