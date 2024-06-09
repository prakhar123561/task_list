$.get('/todo/fetch_all_type',function(data){
    
    data.result.map((item)=>{
    var opt = document.createElement('option')
    opt.text = item.typename
    opt.value = item.typeid
    typeid.add(opt)
    })
     
})