Ext.ns("Ext.Authority.workArange"); // 自定义一个命名空间
workArange = Ext.Authority.workArange; // 定义命名空间的别名

/*
 * var data = [ [ '苏A8532', '鼓楼中心停车场', '进入', '2016.7.8 9:00' ], [ '苏A8532',
 * '明基医院诊所', '离开', '2016.7.8 12:00' ] ];
 */
/*
 * var store = new Ext.data.SimpleStore({ data : data, fields : [ "user name",
 * "department", "position", "shifting of time" ] });
 */
// EditorGridPanel能在线编辑数据
	var store = new Ext.data.Store({
		id : "store_id",
		proxy : new Ext.data.HttpProxy({  
			   url : '/user/getUser',  
			   type : 'ajax'  
			   }), 
		reader : new Ext.data.JsonReader(
            {
            	root:'root',
            	type:'json'
            }, //root为存储json格式数据的变量
            [
             	{name :'userName'},
             	{name :'department'},
             	{name :'position'},
             	{name :'shiftingOfTime'}
             ]),
        autoLoad : true,
        
    	listeners:{
    	      load:function(store, records, options){
    		  alert(store.getCount());//打印测试
    	        /* Ext.getCmp('trainaddr1').setValue(records[0].get('sprotid'))*/
    	      }
    	   }
	});
	
	store.load({//加载
		autoLoad:true
	});
	
	workArange.grid = new Ext.grid.EditorGridPanel({
		height : 150,
		width : 650,
		columns : [ {
			header : "车牌号",
			dataIndex : "userName",
			sortable : true,
			editor : new Ext.form.TextField()
		}, {
			header : "位置读卡器",
			dataIndex : "department",
			sortable : true,
			editor : new Ext.form.TextField()
		}, {
			header : "事件类型",
			dataIndex : "position",
			sortable : true,
			editor : new Ext.form.TextField()
		}, {
			header : "时间",
			dataIndex : "shiftingOfTimeime",
			sortable : true,
			editor : new Ext.form.TextField()
		}, ],
		store : store
		//autoExpandColumn : 2
	});
	workArange.myPanel = new Ext.form.FormPanel({
		width : 650,
		autoHeight : true,
		frame : true,
		// renderTo : "a",
		renderTo : Ext.getBody(),
		layout : "form", // 整个大的表单是form布局
		labelWidth : 65,
		labelAlign : "right",
		title : '车辆盘存',
		items : [ {// 行1
			layout : "form",
			items : [ workArange.grid ]
		} ]
	});