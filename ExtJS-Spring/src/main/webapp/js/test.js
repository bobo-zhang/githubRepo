Ext.onReady(function(){  
    var proxy = new Ext.data.HttpProxy({url:'/ExtJS/pages.do'});  

    var record = new Ext.data.Record.create([  
        {name:'hid',type:'int',mapping:'hid'},  
        {name:'name',type:'string',mapping:'name'},  
        {name:'sex',type:'string',mapping:'sex'},  
        {name:'birthday',type:'string',mapping:'birthday'},  
        {name:'edu',type:'string',mapping:'edu'},  
        {name:'memo',type:'string',mapping:'memo'}  
    ]);  
    var reader = new Ext.data.JsonReader({totalProperty:'totalProperty',root:'root'},record);  
    var store = new Ext.data.Store({  
        proxy:proxy,  
        reader:reader  
    });  
     
    store.load({params:{start:0,limit:10}});  
    var cm = new Ext.grid.ColumnModel([  
        new Ext.grid.RowNumberer(),  
        {header:'ID',width:40,dataIndex:'hid'},  
        {header:'姓名',width:80,dataIndex:'name',tootip:'这是您的姓名'},  
        {header:'性别',width:40,dataIndex:'sex',align:'center'},  
        {header:'生日',width:150,dataIndex:'birthday'},  
        {header:'学历',width:80,dataIndex:'edu',align:'center'},  
        {id:'memo',header:'备注',dataIndex:'memo'}  
    ]);  
    var pagebar = new Ext.PagingToolbar({  
        store:store,  
        pageSize:10,  
        displayInfo:true,  
        displayMsg:'本页显示第{0}条到第{1}条的记录，一共条{2}。',  
        emptyMsg:'没有记录'  
    });  
    var grid = new Ext.grid.GridPanel({  
        renderTo:Ext.getBody(),  
        title:'中国公民',  
        width:650,  
        autoHeight:true,  
        autoExpandColumn:'memo',  
        cm:cm,  
        store:store,  
        bbar:pagebar  
    });  
});  