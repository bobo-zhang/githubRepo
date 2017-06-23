Ext
		.onReady(function() {

			// 创建本地数据
			var store = new Ext.data.Store({
				id : "stock",
				proxy : new Ext.data.HttpProxy({
					method:'GET',
					url : 'api/serviceManage/ambulance/stock2',
					type : 'ajax'
				}),
				reader : new Ext.data.JsonReader({
					root : 'entity',
					totalProperty:'total',
					type : 'json'
				}, // root为存储json格式数据的变量
				[ {
					name : 'remainNumber'
				}, {
					name : 'department'
				}, {
					name : 'outNumber'
				}, {
					name : 'visitedNumber'
				} ]),
				listeners : {
					load : function() {

					}
				}
			});

			var pageSizes=20;
			store.load({// 加载
				params:{startIndex:0,pageSize:pageSizes},
			});
            var pagingToolbar = new Ext.PagingToolbar({
                store: store,
                displayInfo: true,
                displayMsg: ' 第 {0} - {1}条 共 {2} 条数据',
                emptyMsg: "没有任何数据",
                //以上为主要信息
                pageSize: pageSizes,
            });
			var grid = new Ext.grid.EditorGridPanel({
				autoHeight : true,
				id:'saveCar',
				//requires: ['Ext.ux.picker.DateTime', 'Ext.ux.form.field.DateTime'],
				// width : 650,
				 colModel: new Ext.grid.ColumnModel(
							[
					        new Ext.grid.RowNumberer({
					        	header:'序号',
					        	width:'40'
					        }),
					        {
								header : "单位名称",
								width:290,
								dataIndex : "department",
								sortable : true,
								editor : false
							}, {
								header : "本站数量",
								width:290,
								dataIndex : "remainNumber",
								sortable : true,
								editor : false
							}, {
								header : "外站数量",
								width:290,
								dataIndex : "visitedNumber",
								sortable : true,
								editor : false
							}, {
								header : "外出数量",
								width:290,
								dataIndex : "outNumber",
								sortable : true,
								editor : false
							}
					        ]),
					        viewConfig: {
					            forceFit: true,					        
					        },
					        sm: new Ext.grid.RowSelectionModel({singleSelect:true}),

					        frame: true,
					        iconCls: 'icon-grid',			
				store : store,
				//bbar : pagingToolbar
                bbar: new Ext.PagingToolbar({
                    store: store,       // grid and PagingToolbar using same store
                    displayInfo: true,
                    pageSize: pageSizes,
                    prependButtons: true,
                    items: [
                        'text 1'
                    ]
                })
			});

			
			// 总体布局，extjs是先写细节，再定义总体布局。
			// FormPanel作用：可以利用其它组件，创建出一个占屏幕更小的健壮的表单。而不是整整一页
			//单位下拉框数据库
			var Dpstore=new Ext.data.Store({
				id:'depart',
				proxy:new Ext.data.HttpProxy({
					url:'api/realtime/orgResource',
					type:'ajax'
				}),
				
			    reader:new Ext.data.JsonReader({
			    	root:'entity',
			        type:'json'
			    },
				[
					{name:'text',mapping:'org.orgName'},
					{name:'value',mapping:'org.orgId'}
				]
			    ),
			    autoLoad:true
			});
			var myPanel = new Ext.form.FormPanel(
					{
						// width : 650,
						autoHeight : true,
						frame : true,
						// renderTo : "a",
						renderTo : Ext.getBody(),// 输出到。。。
						//requires: ['Ext.ux.picker.DateTime', 'Ext.ux.form.field.DateTime'],
						layout : "form", // 整个大的表单是form布局
						labelWidth : 65,
						labelAlign : "center",
						// title : '车辆盘存',
						items : [
								{
									layout : 'column',
									height : 40,
									border : false,
									items : [
											{
												columnWidth : .4,
												layout : "form",
												border : false,
												items : [ {
                                                    xtype:'combo',
                                                    store:Dpstore,//测试用本地数据源。
                                                    fieldLabel:'位置',
                                                    labelAlign : 'center',
                                                    labelWidth : 100,
                                                    id:'department',
                                                    name :'department',
                                                    displayField: 'text' ,
                                                    valueField  : 'value',
                                                    mode: 'local',
                                                    triggerAction:'all',
                                                    labelWidth: 80,
                                                    width : 200,
                                                    listeners:{
                                                        select:function () {

                                                        }

                                                    }
												} ]
											},
											{
												columnWidth : .4,
												border : false,
												layout : "form",
												items : [ {
													xtype : 'datefield',
													width : '200',
													name : 'starttime',
													id : 'starttime',
													fieldLabel : '盘存时间',
													labelAlign : 'center',
													labelWidth : 55,
													format : 'Y-m-d G:i:s',
													selectOnFocus : true,
													anchor : '48%'
												} ]
											},
											{
												columnWidth : .2,
												layout : 'form',
												border : false,
												items : [ {
													buttonAlign : "center",
													buttons : [
															{
																text : "查询",
																handler : function() {
																	var dep=Ext.getCmp("department").getValue();
																	console.log("位置名："+dep);
                                                                    var startTime = Ext
                                                                        .getCmp(
                                                                            "starttime")
                                                                        .getValue();
                                                                    console.log("时间:"+startTime);
																	var store = Ext
																			.getCmp('saveCar')
																			.getStore();
																	store.baseParams={
																		orgId:dep,
																		startTime:formatDate(startTime),

																	}
																	store.reload({
																		params:{
																		start:0,
																		limit:pageSizes
																	}});
																}
															},
															{
																text : "打印",
																handler : function() {

																}

															} ]
												} ]
											} ]
								},							
								{// 行1
									layout : "form",
									items : [ grid ]
								} ]
					});

            function formatDate(value){
                if((null == value)||("" == value)){
                    return null;
                }else
                    return Ext.util.Format.date(new Date(value),'YmdGis');
            }
		})