Ext.onReady(function(){
Ext.ns("Ext.Authority.workArange"); // 自定义一个命名空间
		workArange = Ext.Authority.workArange; // 定义命名空间的别名
		//创建本地数据
		var store = new Ext.data.Store({
			/*id : "store_id",*/
			proxy : new Ext.data.HttpProxy({  
				   url : '/check/getList',  
				   type : 'ajax'  
				   }),
			reader : new Ext.data.JsonReader(
	            {
	            	root:'root',
	            	type:'json'
	            }, //root为存储json格式数据的变量
	            [
	             	{name : 'name'},
	             	{name : 'department'},
					{name : 'vacancy'},
	             	{name : 'position'}
	             ]),
	        autoLoad : true,
	        
	    	listeners:{
	    	      load:function(){
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
				header : "人员",
				dataIndex : "name",
				sortable : true,
				editor : new Ext.form.TextField()
			}, {
				header : "位置",
				dataIndex : "department",
				sortable : true,
				editor : new Ext.form.TextField()
			}, {
				header : "描述",
				dataIndex : "vacancy",
				sortable : true,
				editor : new Ext.form.TextField()
			}, {
				header : "时间",
				dataIndex : "position",
				sortable : true,
				editor : new Ext.form.TextField()
			}],
			store : store,
			autoExpandColumn : 2
		});
		
		//总体布局，extjs是先写细节，再定义总体布局。
		//FormPanel作用：可以利用其它组件，创建出一个占屏幕更小的健壮的表单。而不是整整一页
		workArange.myPanel = new Ext.form.FormPanel({
			width : 650,
			autoHeight : true,
			frame : true,
			//renderTo : "a",
			renderTo : Ext.getBody(),//输出到。。。
			layout : "form", // 整个大的表单是form布局
			labelWidth : 65,
			labelAlign : "right",
			title : '人员动态查询',
			items : [ {//行1
				layout : "form",
				items : [ workArange.grid ]
			},{// 行3
	            layout : "column",// 从左往右的布局
	            items : [{
	                columnWidth : 1, // 该列有整行中所占百分比
	                layout : "form", // 从上往下的布局
	                items : [{
	                    buttonAlign: "right",
	                    buttons : [{
	                        text : "查询"
	                    },
	                    {
	                        text : "排序"
	                    },{
	                        text : "打印",
	                        handler: function(){
	                           
	                        }

	                    }]
	                }]
	            }]
	        } ]
		});
})