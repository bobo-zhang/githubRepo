Ext.onReady(function() {
	Ext.QuickTips.init();

    /*var data=[
    	['1111220061', '沪H-36221','救护站1','11011'],
        ['1110100041', '沪B-1022','横沙分店','11012']
	];
    var store=new Ext.data.SimpleStore({
		data:data,
		fields:["carId","carBrand","orgName", "rfidTag"]});*/
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

	var grid = new Ext.grid.EditorGridPanel({
		id : 'bindingCar',
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
            }]),
		store : store,
		//单独提交grid的操作。
        buttons : [ {
            text : "重置",
            handler : reset
        }, {
            text : "提交",
            handler : function() {
                // var m = store.getModifiedRecords().slice(0,store.getCount());
                // alert("store 中的数据由："+store.getCount());

                var m = store.getModifiedRecords();//获取改数据。
                var jsonArray = [];
                Ext.each(m, function (item) {
                    jsonArray.push(item.data);
                });
                var json=Ext.encode(jsonArray);
                var sendJson={
                    jsonArray:jsonArray,
				};

                if (jsonArray.length > 0) {
						/*Ext.Ajax.request({
							method: 'POST',
							url: "/api/admin/rfid/bind2",
                            headers:{
								'Content-Type':"application/json;charset=UTF-8",
							},

                            success: function (response) {
								Ext.Msg.alert('提示', '成功');
							},
							failure: function () {
								Ext.Msg.alert('提示', '失败');
							},
							//params:{jsonArray:encodeURIComponent(Ext.encode(jsonArray))}
							params: {jsonArray:"json"}
                            //params: {jsonArray: jsonArray}
						});*/
						$.ajax({
							url:"/api/admin/rfid/bind2?resourceType=ambulance",
							contentType:"application/json",
							type:"POST",
							dataType:'json',
                            data: JSON.stringify(sendJson),

                        })
                }else {
                    Ext.Msg.alert('提示', '没有信息被修改');
				}
            }
        } ],
        buttonAlign : 'center',
	});

	//把grid放进form中，然后随form一起提交。
	/*ar myStore = Ext.getCmp('car').getStore(); //取出列表的Store
	//alert("获取到的数据源1："+myStore);
    var myRecord= myStore.getRange(); //将Store里的所有record放到myRecord里
    var myJson = [];
    //alert("获取到的数据源2："+myRecord);
    for(var j in myRecord){            //遍历所有的record，将其放置在对应的myJson数组里
        myJson .push({
            'carId': myRecord[i].get('carId'),
            'carBrand': myRecord[i].get('carBrand'),
            'orgName': myRecord[i].get('orgName'),
            'rfidTag': myRecord[i].get('rfidTag'),
            'time': myRecord[i].get('time'),         
        });
    	alert("第"+j+"个数据");
    };*/
   
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
				border : false,
				layout : "form",
				items : [ {
					xtype : "textfield",
					id:'begain',
					fieldLabel : "起始RFID",
					width : 200
				} ]
			}, {
				columnWidth : .4,
				border : false,
				layout : "form",
				items : [ {
					xtype : "textfield",
					id:'end',
					fieldLabel : "终止RFID",
					width : 200
				} ]
			}, {
				columnWidth : .2,
				layout : 'form',
				border : false,
				defaultType : 'radio',
				items : [ {

					fieldLabel : '',
					labelSeparator : '',
					boxLabel : '批量绑定',
					name : 'binding',
					inputValue:'0',
					listeners:{
                        'check': function() {
                        	var begain=parseInt(Ext.getCmp("begain").getValue());
                        	console.log("开始标签数字："+begain);
                        	var end=parseInt(Ext.getCmp("end").getValue());
                        	console.log("结束标签数字："+end);
                            if(end>begain){
                            	console.log("函数开始执行");
                            	var stores=Ext.getCmp("bindingCar").getStore();
                            	var count=stores.getCount();
                                console.log("获取未绑定车辆个数:"+count);
                            	if((begain+count) <= end){
										for(var i=0;i<count;i++){
											stores.getAt(i).set("rfidTag",begain+i);
											console.log("第"+i+"个数据绑定的标签是："+stores.getAt(i).get("rfidTag"));
										}

                                }else{
                                    Ext.Msg.alert("标签太少，无法全部绑定");
								}
							}else {
                            	Ext.Msg.alert("请更改标签开始和结束大小");
							}
                        }
					},
				}, {
					checked : true,
					fieldLabel : '',
					labelSeparator : '',
					boxLabel : '手工选择',
					name : 'binding',
					inputValue : '1',
					listeners:{
						'check':function () {
						console.log("手工绑定")
                        }
					}

				} ]
			} ]
		}, {
			layout : 'form',
			items : [ grid ]
		}/*,{
			xtype : "textfield",
			fieldLabel : "隐藏的域",
			id:'hiddenField',
			hidden: true,
			hideLabel:true,
		} */],
		/*buttons : [ {
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
		buttonAlign : 'center'*/

	});
    //Ext.getCmp('hiddenField').setValue(Ext.encode(myJson));//编译myJson数组为一个Json对象，并放置在id为‘hiddenField’的隐藏域里，注意隐藏域要放置在表单里。

	function reset() {
		myPanel.form.reset();
	}
})