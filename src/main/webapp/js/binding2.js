Ext.onReady(function() {
	Ext.QuickTips.init();
	
	var store = new Ext.data.Store({
        restful:true,
		proxy : new Ext.data.HttpProxy({
			method:'GET',
            url : '/api/admin/ambulance?mode=unbound',
            type : 'ajax'
        }),
        reader : new Ext.data.JsonReader(
            {
                root:'entity',
                //totalProperty: 'total',
                type:'json'
            }, // root为存储json格式数据的变量
            [
                {name :'carId'},
                {name :'carBrand'},
                {name :'orgName'},
                {name :'rfidTag'},
               // {name :'time'}
            ]),
        autoLoad : true
    });

    //分页工具
	//var pageSize=10
	//store.load({ params: { start: 0, limit: pageSize} });

	/* var pagingToolbar = new Ext.PagingToolbar({
	       store: store,
	       displayInfo: true,  
          displayMsg: ' 第 {0} - {1}条 共 {2} 条数据',  
          emptyMsg: "没有任何数据",  
          //以上为主要信息
          pageSize: 10,
	   });*/
	 
	var grid = new Ext.grid.EditorGridPanel({
		id : 'car',
		height : 400,
        colModel: new Ext.grid.ColumnModel(
            [
                new Ext.grid.RowNumberer({
                    header:'序号',
                    width:'40'
                }),
	   {
			header : "车辆编号",
			width:290,
			dataIndex : "carId",
			sortable : true,
			editor : false
		}, {
			header : "车牌号",
			width:290,
			dataIndex : "carBrand",
			sortable : true,
			editor : false
		}, {
			header : "所属单位",
			width:290,
			dataIndex : "orgName",
			sortable : true,
			editor : false
		}, {
			header : "RFID_tag",
			width:290,
			dataIndex : "rfidTag",
			sortable : true,
			editor : true
		}/*, {
			header : "绑定时间",
			width:240,
			dataIndex : "time",
			sortable : true,
			editor : false,
			renderer : function(value) {
                if (value == null || value == 0) {
                    return 'null'
                } else {
                    return Ext.util.Format.date(new Date(parseInt(value)),
                        'Y-m-d H:i:s')
                }
            }
		} */]),
		store : store,
		//单独提交grid的操作。
		tbar:[{
				text:'保存',
				handler:function(){
					var m = store.getModifiedRecords().slice(0);
					var jsonArray = [];
					Ext.each(m,function(item){
						jsonArray.push(item.data);
					});
					alert("shuzu:"+jsonArray);
					Ext.Ajax.request({
						method:'POST',
						url:"/api/admin/rfid/bind",
						success:function(response){
							Ext.Msg.alert('提示','成功');
						},
						failure:function(){
							Ext.Msg.alert('提示','失败');
						},
						params:'jsonArray='+encodeURIComponent(Ext.encode(jsonArray))
					});
				}
			}],
	// autoExpandColumn:2
		//bbar:pagingToolbar
	});

	//把grid放进form中，然后随form一起提交。
	var myStore = Ext.getCmp('car').getStore(); //取出列表的Store
	//alert("获取到的数据源1："+myStore);
    var myRecord= myStore.getRange(); //将Store里的所有record放到myRecord里
    var myJson = [];
    alert("获取到的数据源2："+myRecord);
    for(var j in myRecord){            //遍历所有的record，将其放置在对应的myJson数组里
        myJson .push({
            'carId': myRecord[i].get('carId'),
            'carBrand': myRecord[i].get('carBrand'),
            'orgName': myRecord[i].get('orgName'),
            'rfidTag': myRecord[i].get('rfidTag'),
        });
    	alert("第"+j+"个数据");
    };
   
    var myPanel = new Ext.form.FormPanel({
		autoHeight : true,
		frame : true,
		renderTo : Ext.getBody(),
		layout : "form", // 整个大的表单是form布局
		labelWidth : 65,
		labelAlign : "left",
		title : '绑定记录',
		items : [ {
			layout : 'column',
			height : 40,
			border : false,
			items : [ {
				columnWidth : .4,
				boder : false,
				layout : "form",
				items : [ {
					xtype : "textfield",
					fieldLabel : "起始RFID",
					width : 200
				} ]
			}, {
				columnWidth : .4,
				boder : false,
				layout : "form",
				items : [ {
					xtype : "textfield",
					fieldLabel : "终止RFID",
					width : 200
				} ]
			}, {
				columnWidth : .2,
				layout : 'form',
				boder : false,
				defaultType : 'radio',
				items : [ {
					
					fieldLabel : '',
					labelSeparator : '',
					boxLabel : '批量绑定',
					name : 'fav-color',
					inputValue : 'blue'
				}, {
					checked : true,
					fieldLabel : '',
					labelSeparator : '',
					boxLabel : '手工选择',
					name : 'fav-color',
					inputValue : 'green'
				} ]
			} ]
		}, {
			layout : 'form',
			items : [ grid ]
		},{	
			xtype : "textfield",
			fieldLabel : "隐藏的域",
			id:'hiddenField',
			hidden: true, 
			hideLabel:true,
		} ],
		buttons : [ {
			text : "重置",
			handler : reset
		}, {
			text : "提交",
			handler : function() {
				var form = this.up("form").getForm();
				if (form.isValid()) {
					form.submit({
						url : '',
						method : 'post',
						waitMsg : 'wating...',
						success : function(fp, o) {
							Ext.Msg.alert('Success', 'success');
						},
						failure : function(form, action) {
							Ext.Msg.alert('失败', action.result.msg)
						}
					})
				}
			}
		} ],
		buttonAlign : 'center'

	});
    Ext.getCmp('hiddenField').setValue(Ext.encode(myJson));//编译myJson数组为一个Json对象，并放置在id为‘hiddenField’的隐藏域里，注意隐藏域要放置在表单里。
	
	function reset() {
		myPanel.form.reset();
	}
})