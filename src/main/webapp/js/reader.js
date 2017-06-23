Ext.onReady(function() {
    Ext.QuickTips.init();
    
       
    var store = new Ext.data.Store({
        restful:true,
        proxy : new Ext.data.HttpProxy({
            url : '/api/admin/reader/getList',
            type : 'ajax'
        }),
        reader : new Ext.data.JsonReader(
            {
                root:'entity',
                // totalProperty: 'total',
                type:'json'
            }, // root为存储json格式数据的变量
            [
                {name :'readerId'},
                {name :'shutdownTime'},
                {name :'activeTime'},
                {name :'containerName'},
                {name :'activated'},
                {name :'department'},
                {name :'com'}
            ]),
        autoLoad : true
    });

    var grid = new Ext.grid.EditorGridPanel({
        id : 'reader',
        height : 450,
        colModel: new Ext.grid.ColumnModel(
            [
                new Ext.grid.RowNumberer({
                    header:'序号',
                    width:'40'
                }),
                {
                    header : "读卡器标识",
                    width:170,
                    dataIndex : "readerId",
                    sortable : true,
                    //editor : false
                }, {
                header : "所属容器",
                width:170,
                dataIndex : "containerName",
                sortable : true,
                //editor : false
            },{
                header : "是否激活",
                width:170,
                dataIndex : "activated",
                sortable : true,
                // editor : true
            }, {
                header : "激活时间",
                width:170,
                dataIndex : "activeTime",
                sortable : true,
                renderer : function(value) {
                    if (value == null || value == 0) {
                        return 'null'
                    } else {
                        return Ext.util.Format.date(new Date(parseInt(value)),
                            'Y-m-d G:i:s')
                    }
                }
                //editor : false
            },{
                header : "关闭时间",
                width:170,
                dataIndex : "shutdownTime",
                sortable : true,
                renderer : function(value) {
                    if (value == null || value == 0) {
                        return 'null'
                    } else {
                        return Ext.util.Format.date(new Date(parseInt(value)),
                            'Y-m-d G:i:s')
                    }
                }
                // editor : true
            }, {
                header : "部门",
                width:170,
                dataIndex : "department",
                sortable : true,
                //editor : true
            }
            ,{
                header : "通信标识",
                width:170,
                dataIndex : "com",
                sortable : true,
                editor : false
            }
            /*,{
                header : "备注",
                width:240,
                dataIndex : "note",
                sortable : true,
                editor : true
            }*/
            ]),
        store : store,
        //单独提交grid的操作。
        buttons : [ {
            text : "增加",
            handler : function() {
				addPanel.getForm().reset();// 新增前清空表格内容
				addWindow.show();
			}
        }, {
            text : "删除",
            handler : function() {
				var records=grid.getSelectionModel().getSelection();
				alert(records);
				grid.getStore().remove(records);
			}
        },{
            text : "编辑",
            handler: function(){
               
            }
        } ],
        buttonAlign : 'center',
    });

    
  //1、容器所属
	var Wherestore=new Ext.data.Store({
		proxy:new Ext.data.HttpProxy({
			url:'/api/admin/container/list',
			type:'ajax'
		}),
		
	    reader:new Ext.data.JsonReader({
	    	root:'entity',
	        type:'json'
	    },
	    [{name:'text',mapping:'containerName'},{name:'value',mapping:'containerId'}]),
	    autoLoad:true
	});
	// 新增panel
	var addPanel = new Ext.form.FormPanel({
		items : [ 
			{
			xtype : "textfield",
			id : "readerId",
			name : "readerId",
			width:200,
			allowBlank:false, 
			blankText:"该输入项不能为空！",   
			fieldLabel : "容器标识"
			},{
			xtype : "combo",
			store:Wherestore,
			displayField: 'text' ,
			id:'containerId',
       	    valueField  : 'value',
       	    width:200,
                mode: 'local',
                triggerAction:'all',
			allowBlank:false,
			blankText:"该输入项不能为空！",   
			fieldLabel : "所属容器"
		    }, {
                xtype : "textfield",
                id :'actived',
                name:'actived',
                allowBlank:false,
                width:200,
                blankText:"该输入项不能为空！",
                fieldLabel : "是否激活"
            }, {
			xtype : 'datefield',
			labelAlign : 'center',
			format : 'Y-m-d G:i:s',
			//anchor : '45%',	
			id : "activeTime",
			name : "activeTime",
			width:200,
			allowBlank:false, 
			blankText:"该输入项不能为空！",   
			fieldLabel : "激活时间"
		}, {
                xtype : 'datefield',
                labelAlign : 'center',
                format : 'Y-m-d G:i:s',
                //anchor : '45%',
                id : "shutdownTime",
                name : "shutdownTime",
                width:200,
                allowBlank:false,
                blankText:"该输入项不能为空！",
                fieldLabel : "关闭时间"
            }, {
			xtype : "textfield",			
			id : "department",
			name : "department",
			allowBlank:false, 
			width:200,
			blankText:"该输入项不能为空！",   
			fieldLabel : "部门"
		}, {
			xtype : "textfield",
			id :'com',
			name:'com',
			allowBlank:false, 
			width:200,
			blankText:"该输入项不能为空！",  
			fieldLabel : "通信标识"
		} ]
	});

	// 新增窗口
	var addWindow = new Ext.Window({
		title : "新增读卡器管理",
		closeAction : "hide",// 设置该属性新增窗口关闭的时候是隐藏
		width : 400,
		height : 500,
		items : addPanel,
		layout : "fit",
		bbar : {
			xtype : "toolbar",
			items : [ {
				xtype : "button",
				text : "保存",
				listeners : {
					"click" : function(btn) {
						//alert("执行保存操作");
						
						var form = addPanel.getForm();
						//读卡器标识
						var readerId =form.findField("readerId").getValue();
						alert("readerId:"+readerId);
						//所属容器
						var containerName=form.findField("containerId").getValue();
						alert("containerName:"+containerName);
						//激活时间
						var activeTime=form.findField("activeTime").getValue();
						//varactiveTime=formatDate(activetime);
						alert("activeTime:"+activeTime);
						//是否激活
						var actived=form.findField("actived").getValue();
						//部门
						var department=form.findField("department").getValue();
						var model=[];
						alert("显示model中的数值:"+model);
						model.push(readerId);
						model.push(containerName);
						model.push(activeTime);
						model.push(actived);
						model.push(department);
						var sendJson={
			                    jsonArray:model,
							};
						alert("添加数据后的model数值："+JSON.stringify(sendJson));
						 if (model.length > 0) {
								$.ajax({
									url:"/api/admin/reader/create",
									contentType:"application/json",
									type:"POST",
									dataType:'json',
		                            data: JSON.stringify(sendJson),

		                        })
		                }else {
		                    Ext.Msg.alert('提示', '没有信息被修改');
						}
						
					}
				}
			}, {
				xtype : "button",
				text : "取消",
				listeners : {
					"click" : function(btn) {
						btn.ownerCt.ownerCt.close();//关闭后不能新加
					}
				}
			} ]
		}
	});
    
    var myPanel = new Ext.form.FormPanel({
        autoHeight : true,
        frame : true,
        renderTo : Ext.getBody(),
        layout : "form", // 整个大的表单是form布局
        labelWidth : 65,
        labelAlign : "left",
        title : '读卡器管理',
        items : [ {
            layout : 'form',
            items : [ grid ]
        }],

    });
    function reset() {
        myPanel.form.reset();
    }
    function formatDate(value) {
		if ((null == value) || ("" == value)) {
			return null;
		} else
			return Ext.util.Format.date(new Date(value), 'YmdGis');
	}
})
