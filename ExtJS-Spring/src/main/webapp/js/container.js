Ext.onReady(function() {
	Ext.QuickTips.init();

	
	  var store = new Ext.data.Store({ 
		proxy : new Ext.data.HttpProxy({
		  	url : '/api/admin/container/list', 
		  	type : 'ajax' 
	  	}), 
	     reader : new Ext.data.JsonReader( 
	      {
	    	 root:'entity', //
	    	// totalProperty: 'total', 
	    	 type:'json' 
	      }, 
	      [
	    	 {name :'containerId'},
	    	 {name :'containerName'},
	    	 {name :'department'},
	    	 {name :'type'},
	    	 //{name :'lastScanTime'}
		   ]),
		 autoLoad : true 
		 });

	var pageSize = 10;
	/*
	 * store.load({// 加载 params : { startIndex : 0, pageSize : pageSize }, });
	 */

	var pagesizeCombo = function() {
		return new Ext.form.ComboBox({
			store : new Ext.data.SimpleStore({
				fields : [ 'id', 'value' ],
				data : [ [ '10', 10 ], [ '20', 20 ], [ '30', 30 ],
						[ '50', 50 ], [ '100', 100 ] ]
			}),
			mode : 'local',
			displayField : 'id',
			valueField : 'value',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			width : 60,
			listeners : {
				render : function(comboBox) {
					comboBox.setValue(comboBox.ownerCt.pageSize); // 使得下拉菜单的默认值是初始值

				},
				select : function(comboBox) {
					var pSize = comboBox.getValue();
					comboBox.ownerCt.getStore().pageSize = parseInt(pSize); // 改变PagingToolbar的pageSize
					// 值

				}
			}
		});
	}
	var pagingToolbar = new Ext.PagingToolbar({
		store : store,
		displayInfo : true,
		displayMsg : ' 第 {0} - {1}条 共 {2} 条数据',
		emptyMsg : "没有任何数据",
		items : [ '-', '每页', pagesizeCombo(), '条' ],
		// 以上为主要信息
		pageSize : pageSize,
	});
	var grid = new Ext.grid.GridPanel({
		id : 'container',
		height : 450,
		colModel : new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer({
			header : '序号',
			width : '40'
		}), {
			header : "容器标识",
			width : 230,
			dataIndex : "containerId",
			sortable : true,
			editor : false
		}, {
			header : "容器名",
			width : 230,
			dataIndex : "containerName",
			sortable : true,
			editor : false
		}
		, {
			header : "容器类型",
			width : 230,
			dataIndex : "type",
			sortable : true,
			editor : false
		}
		, {
			header : "部门",
			width : 230,
			dataIndex : "department",
			sortable : true,
			editor : false
		}
		]),
		// sm : new Ext.grid.RowSelectionModel({singleSelect : false}),
		selModel : new Ext.grid.RowSelectionModel({
			singleSelect : false
		}),
		// sm: new Ext.grid.CheckboxSelectionModel ({ singleSelect: false }),//
		store : store,
		/*
		 * selModel : { selType : "checkboxmodel"//复选框 }, multiSelect : true,
		 */
		//bbar:pagingToolbar,
		buttons : [ {
			text : "增加",
			handler : function() {
				addPanel.getForm().reset();// 新增前清空表格内容
				addWindow.show();
			}
		}, {
			text : "删除",
			handler : function() {
				var records = grid.getSelectionModel().getSelection();
				alert(records);
				grid.getStore().remove(records);
			}
		}, {
			text : "编辑",
			handler : function() {
			}
		} ],
		buttonAlign : 'center',
	});

	// 一些下拉框的数据源。不知道具体有哪些？？？？？？？？？？？？？？？
	// 1、容器描述
	var WhereStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/api/admin/container/list',
			type : 'ajax'
		}),

		reader : new Ext.data.JsonReader({
			root : 'entity',
			type : 'json'
		}, [ {
			name : 'text',
			mapping : 'containerName'
		}, {
			name : 'value',
			mapping : 'containerId'
		} ]),
		autoLoad : true
	});

    // 2、容器类型
    var ContainerType = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : '/api/admin/container/listTableTypes',
            type : 'ajax'
        }),

        reader : new Ext.data.JsonReader({
            root : 'entity',
            type : 'json'
        }, [ {
            name : 'text',
            mapping : 'resourceType'
        }, {
            name : 'value',
            mapping : 'tableName'
        } ]),
        autoLoad : true
    });

    // 3、容器所属
    var ContainerOrg = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : '/api/admin/container/listAllOrg',
            type : 'ajax'
        }),

        reader : new Ext.data.JsonReader({
            root : 'entity',
            type : 'json'
        }, [ {
            name : 'text',
            mapping : 'orgName'
        }, {
            name : 'value',
            mapping : 'orgId'
        } ]),
        autoLoad : true
    });
    // 4、扫描策略
    var ScanPolicy = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : '/api/admin/container/listScanPolicy',
            type : 'ajax'
        }),

        reader : new Ext.data.JsonReader({
            root : 'entity',
            type : 'json'
        }, [ {
            name : 'text',
            mapping : 'paramValueChs'
        }, {
            name : 'value',
            mapping : 'code'
        } ]),
        autoLoad : true
    });
	// 新增panel
	var addPanel = new Ext.form.FormPanel({
		items : [ {
            xtype:'combo',
            store:WhereStore,//测试用本地数据源。
            id:'containerName',
            name :'containerName',
            displayField: 'text' ,
            valueField  : 'value',
            mode: 'local',
            triggerAction:'all',
            width : 200,
            allowBlank : false,
            blankText : "该输入项不能为空！",
			fieldLabel : "容器描述"
		}, {
			xtype : "combo",
			store:ContainerType,
			id : "containerType",
			name : "containerType",
            displayField : 'text',
            valueField : 'value',
            mode: 'local',
            triggerAction:'all',
			allowBlank : false,
			width : 200,
			blankText : "该输入项不能为空！",
			fieldLabel : "容器类型"
		}, {
			xtype : "combo",
			store:ContainerOrg,
			id : "orgId",
			name : "orgId",
			allowBlank : false,
			displayField : 'text',
			valueField : 'value',
            mode: 'local',
            triggerAction:'all',
			width : 200,
			blankText : "该输入项不能为空！",
			fieldLabel : "容器所属"
		}, {
			xtype : "combo",
			store : ScanPolicy,
			displayField : 'text',
			valueField : 'value',
			id : "scanPolicy",
			name : "scanPolicy",
            mode: 'local',
            triggerAction:'all',
			width : 200,
			allowBlank : false,
			blankText : "该输入项不能为空！",
			fieldLabel : "扫描策略"
		} ]
	});

	// 新增窗口
	var addWindow = new Ext.Window({
		title : "新增位置管理",
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
						// alert("执行保存操作");

						var form = addPanel.getForm();
						var containerName = form.findField("containerName").getValue();
						Ext.Msg.alert("窗口显示", containerName);
						var containerType = form.findField("containerType").getValue();
						var orgId = form.findField("orgId").getValue();
						var scanPolicy = form.findField("scanPolicy").getValue();
						var model = [];
						alert("显示model中的数值:" + model);
						model.push(containerName);
						model.push(containerType);
						model.push(orgId);
						model.push(scanPolicy);
						var sendJson = {
							jsonArray : model,
						};
						alert("添加数据后的model数值：" + JSON.stringify(sendJson));
						if (model.length > 0) {
							$.ajax({
								url : "/api/admin/container/create",
								contentType : "application/json",
								type : "POST",
								dataType : 'json',
								data : JSON.stringify(sendJson),
								
								success:function (data) {
                                    if (data != null ) {

                                            alert("添加成功！");
                                    }
                                    else {
                                        alert("请重新尝试！");
                                    }
                                }
								
							})
						} else {
							Ext.Msg.alert('提示', '没有信息被修改');
						}

					}
				}
			}, {
				xtype : "button",
				text : "取消",
				listeners : {
					"click" : function(btn) {
						btn.ownerCt.ownerCt.close();// 关闭后不能新加
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
		title : '位置管理',
		items : [ {
			layout : 'form',
			items : [ grid ]
		} ],

	});
	function reset() {
		myPanel.form.reset();
	}
	function isEmpty(value) {
		if (value == null || value == "" || value.trim() == "") {
			return true;
		}
		return false;
	}
})
