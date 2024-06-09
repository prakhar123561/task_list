var express = require('express')
var router = express.Router()
var pool = require('./pool')
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var day
router.get('/todolist',function(req,res,next){
     day = today.toLocaleDateString("en-US", options) 
    // res.redirect('/todo/displaylist')
    res.render('todolist',{kindofday:day,view:false})
})

router.post('/todo_add',function(req,res,next){
    pool.query("insert into todolist(typeid,todoitem) values(?,?)",[req.body.typeid,req.body.newitem],function(err,result){
        if(err){
            res.redirect('/todo/display_list')
        }
        else{
            console.log(result)
            res.redirect('/todo/display_list')
        }
    })
})

router.get('/display_list', function(req, res, next) {
    pool.query('select t.* from todolist t ', function(err, result) {
        if (err) {
            res.render('displaylist', { data: [], status: false, view:true });
        } else {
            if(result.length == 0){
                res.render('displaylist', { data: [], status: true, kindofday: day, view:true });   
            }
            day = today.toLocaleDateString("en-US", options);
            console.log(result)
            res.render('displaylist', { data: result, status: true, kindofday: day, view:true });
        }
    });
});

router.get('/type_list', function(req, res, next) {
    pool.query('SELECT t.typeid, t.typename AS todotype, COUNT(l.todoid) AS item_count FROM todotype t LEFT JOIN todolist l ON t.typeid = l.typeid GROUP BY t.typeid, t.typename ', function(err, result) {
        if (err) {
            res.render('typelist', { data: [], status: false, view:false });
        } else {
            if(result.length == 0){
                res.render('typelist', { data: [], status: true, kindofday: day, view:true });   
            }
            day = today.toLocaleDateString("en-US", options);
            console.log(result)
            res.render('typelist', { data: result, status: true, kindofday: day, view:true });
        }
    });
});

router.post('/todo_delete',function(req,res,next){
    const todoid = req.body.todoid;
    if (Array.isArray(todoid)){
    pool.query('delete from todolist where todoid in (?)',[todoid],function(error,result){
        if (error) {
            console.error('Error deleting the items: ' + error.message);
            res.status(500).send('Error deleting the items');
        } else {
            console.log('Items deleted successfully');
            res.status(200).send('Items deleted successfully');
        }
    })
}
else{
    pool.query('delete from todolist where todoid = ?',[todoid],function(error,result){
        if (error) {
            console.error('Error deleting the items: ' + error.message);
            res.status(500).send('Error deleting the items');
        } else {
            console.log('Items deleted successfully');
           
            res.redirect('/move_to_finished?todoId=' + JSON.stringify(todoId));
        }
    })
}
})

router.get('/move_to_finished', function(req, res, next) {
    const todoId = JSON.parse(req.query.todoId); // Parse the todoId from the query parameter

    // Fetch the deleted "todoitems" from the database
    const query = 'SELECT todoitem FROM todolist WHERE todoid IN (?)';

    pool.query(query, [todoId], function(err, result) {
        if (err) {
            console.error('Error fetching deleted items: ' + err.message);
            res.status(500).send('Error moving items to "finished"');
        } else {
            // Use the pre-configured "finished" typeid (e.g., 1000)
            const finishedTypeId = 105;

            // Insert the deleted "todoitems" into the "finished" category
            const insertQuery = 'INSERT INTO todolist (todoitem, typeid) VALUES (?, ?)';

            result.forEach(function(item) {
                pool.query(insertQuery, [item.todoitem, finishedTypeId], function(err, insertResult) {
                    if (err) {
                        console.error('Error moving items to "finished": ' + err.message);
                        res.status(500).send('Error moving items to "finished"');
                    }
                });
            });

            
            res.render('display_list'); 
        }
    });
});


router.get('/fetch_all_type',function(req,res,next){
    pool.query('select * from todotype',function(error,result){
        console.log(result)
        if(error){
            console.log(error)
          res.status(500).json({result:[],message:'invalid data ..... issue in server'})
        }
        else{
            console.log(result)
            res.status(200).json({result:result,message:'success'})
        }
    })
})

router.get('/showdropdown',function(req,res,next){
    res.render('dropdown',{message:''})
})

module.exports = router