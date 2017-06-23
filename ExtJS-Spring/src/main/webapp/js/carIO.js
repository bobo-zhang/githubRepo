Ext.onReady(function() {
			
		
			var store = new Ext.data.Store({
                storeId:'myStore',
				restful:true,
				proxy : new Ext.data.HttpProxy({
					method:'GET',
					url :'/api/serviceManage/ambulance/dynamic',
					type : 'ajax'
				}),
				reader : new Ext.data.JsonReader({
					root : 'entity',
					totalProperty: 'total',
					type : 'json'
				}, // root为存储json格式数据的变量
				[ {
					name : 'carBrand'
				}, {
					name : 'containerName'
				}, {
					name : 'eventType'
				}, {
					name : 'time'
				} ]),
				//autoLoad : true,

				listeners : {
					load : function() {

						for(var i=0;i<this.getCount();i++){
                            if(this.getAt(i).get("eventType")=='check_in') {
                                this.getAt(i).set('eventType', '到达');
                            }
                            else{
                                this.getAt(i).set('eventType','离开');
                            }
                        }
					}
				}
			});

			//分页工具
	         var pageSize=10;

             store.load({
				 params:{start:0,limit:pageSize}
             });

			 var pagingToolbar = new Ext.PagingToolbar({			      
			       store: store,
			       displayInfo: true,  
		           displayMsg: ' 第 {0} - {1}条 共 {2} 条数据',  
		           emptyMsg: "没有任何数据",  
		           //以上为主要信息
		           pageSize: pageSize,
			   });
			var grid = new Ext.grid.GridPanel({
				autoHeight : true,
				id:'carIOGrid',
				store : store,
				colModel: new Ext.grid.ColumnModel(
							[
					        new Ext.grid.RowNumberer({
					        	header:'序号',
					        	width:'40'
					        }),	            
				 {
					header : "车辆",
					dataIndex : "carBrand",
					width:290,
					sortable : true,
					editor : false
				}, {
					header : "车辆位置",
					width:290,
					dataIndex : "containerName",
					sortable : true,
					editor : false
				}, {
					header : "事件类型",
					width:290,
					dataIndex : "eventType",
					sortable : true,
					editor : false
				}, {
					header : "时间",
					dataIndex : "time",
					width:290,
					sortable : true,
					editor : false,
					renderer : function(value) {
		                if (value == null || value == 0) {
		                    return 'null'
		                } else {
		                    return Ext.util.Format.date(new Date(parseInt(value)),
		                        'Y-m-d G:i:s')
		                }
		            }
				} ]),

		           bbar: pagingToolbar
			});

		    
			//位置下拉框数据源
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
			// 总体布局，extjs是先写细节，再定义总体布局。
			// FormPanel作用：可以利用其它组件，创建出一个占屏幕更小的健壮的表单。而不是整整一页
			var myPanel = new Ext.form.FormPanel(
					{
						// width : 650,
						autoHeight : true,
						frame : true,
						// renderTo : "a",
						renderTo : Ext.getBody(),// 输出到。。。
						layout : "form", // 整个大的表单是form布局
						labelWidth : 65,
						labelAlign : "center",
						// title : '车辆动态查询',
						items : [
								{
									layout : 'column',
									height : 60,
									border : false,
									items : [
											{
												columnWidth : .5,
												align : 'left',
												layout : "form",
												border : false,
												items : [ {
								                 	 xtype:'combo',
								                	 store:Wherestore,//测试用本地数据源。
								                	 fieldLabel:'位置',
								                	 labelAlign : 'center',
													 labelWidth : 100,
								                	 id:'containerid',
								                	 name :'containerid',
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
												},{
													xtype : 'datefield',
													width : 200,
													name : 'startTime',
													id : 'startTime',
													fieldLabel : '盘存时间',
													labelAlign : 'center',
													labelWidth : 55,
													format : 'Y-m-d G:i:s',
													anchor : '45%'
												} ]
											},
											{
												columnWidth : .5,
												border : false,
												layout : "form",
												items : [ {
													xtype:'textfield',
													id:'carbrand',
													name:'carbrand',
													fieldLabel:'车辆编号',
													value:null,
													width : 200,
												    },{
													xtype : 'datefield',
													width : 200,
													name : 'endTime',
													id : 'endTime',
													fieldLabel : '具体时间',
													labelAlign : 'right',
													labelWidth : 55,
													format : 'Y-m-d G:i:s',//24小时制。
													anchor : '45%'
												} ]
											},
										]
								}, 
								{
								layout : 'form',
								border : false,
								items : [ {
									buttonAlign : "right",
									buttons : [
											{
												text : "查询",
												handler : function() {
													var startTime=Ext.getCmp("startTime").getValue();
													console.log("startTime:"+formatDate(startTime));

													var endTime=Ext.getCmp("endTime").getValue();
													console.log("endTime:"+formatDate(endTime));

													var stores=Ext.getCmp('carIOGrid').getStore();
													console.log("stores:"+stores.getCount());

													var carBrand=Ext.getCmp("carbrand").getValue();
                                                    console.log("carBrand:"+carBrand);

													var containerID=Ext.getCmp("containerid").getValue();
													console.log("containerID:"+containerID);

													stores.baseParams={
                                                            startTime:formatDate(startTime),
                                                            endTime:formatDate(endTime),
                                                            carBrand:carBrand,
                                                            containerId:containerID,
                                                    };
													stores.reload({
														params:{
															start:0,
                                                            limit: pageSize,
														}
													});
												}
											},
											{
												text : "打印",
												handler : function() {

												}

											} ]
								} ]
								},
								{// 行1
									layout : "form",
									items : [grid ]
								} ]
					});
		function formatDate(value){
			if((null == value)||("" == value)){
				return null;
			}else
				return Ext.util.Format.date(new Date(value),'YmdGis');
		}
})