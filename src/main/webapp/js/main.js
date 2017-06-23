Ext.onReady(function() {
			Ext.QuickTips.init();

			//第一部分，页面工具栏
			var tbar = {
				items : [
				    '->',{					
					text : '注销',
					align:"center",
					handler:function(){
				        Ext.MessageBox.confirm("提示","您确定要注销吗？",function(e){
				         if(e == "yes"){
				          Ext.Ajax.request({
				             url:'/index.html' + new Date().getTime(),
				             success: function(response){
				            window.location.href = "index.php";                  
				             },          
				             failure: function(){
				             }                 
				          });
				         }
				        }) 
				       },
					iconCls : 'icon-add'
				},'->',{
					text : '您好：',
					align:"center",
				   } ]
			};
			var headerPanel = new Ext.Panel({
				region : 'north',
				height : 50,
				border : false,
				margins : '0 0 0 0',
				title : '120急救RFID车联系统',
				tbar : tbar
			});

			//第二部分，页面主体部分
			var root = {
				title:'root',
				expanded : false,
				children : [ {
					text : '实时监控',
					expanded : true,
					children : [
					  {
						text : '车辆',
						leaf : true,
                        href : "./map.jsp",
						id : '1'
					},{
						text : '人员',
						leaf : true,
						disabled:true,
						href : "erro.html",
						id : '2'
					} ,{
						text : '设备与资产',
						disabled:true,
						leaf : true,                     
						id : '3'
					} ]
				}, {
					text : '业务管理',
					expanded : true,
					children : [ 
			            {
							text : '车辆位置',
							expanded : false,
							children : [ {
								text : '车辆盘存',
								href : "./carSave.jsp",
								leaf : true,
								id : '7'
							}, {
								text : '车辆动态',
								leaf : true,
								href : "./carIO.html",
								id : '8'
							} ]
						}, {
						text : '人员考勤',
							disabled:true,
						expanded : false,
						children : [ {
							text : '在岗情况',
							leaf : true,
							disabled:true,
							href : "erro.html",
							id : '5'
						}, {
							text : '人员动态',
							disabled:true,
							leaf : true,
							href : "erro.html",
							id : '6'
						} ]
					}, {
						text : '设备管理',
						disabled:true,
						expanded : false,
						children : [{}]
					}]
				}, {
					text : '系统配置',
					expanded : true,
					children : [ {
						text : 'RFID系统管理',
						expanded : false,
						children : [ {
							text : '标签绑定',
							leaf : true,
                            href : "./binding.html",
							id : '12'
						}, {
							text : '位置管理',
							leaf : true,
                            href : "./container.html",
							id : '13'
						}, {
							text : '读卡器管理',
							leaf : true,
                            href : "./reader.html",
							id : '14'
						} ]
					}, {
						text : '医疗资源配置',
						expanded : false,
						disabled:true,
						children : [ {
							text : '查看',
							disabled:true,
							leaf : true,
							id : '15'
						} ]
					}, {
						text : '用户权限管理',
						expanded : false,
						disabled:true,
						children : [ {
							text : '用户管理',
							disabled:true,
							leaf : true,
							id : '16'
						}, {
							text : '权限管理',
							disabled:true,
							leaf : true,
							id : '17'
						} ]
					}, {
						text : '日志',
						expanded : false,
						disabled:true,
						children : [ {
							text : '操作日志',
							disabled:true,
							leaf : true,
							id : '18'
						}, {
							text : '告警日志',
							disabled:true,
							leaf : true,
							id : '19'
						} ]
					} ]
				}]
			};
			var menuTree = new Ext.tree.TreePanel(
					{
						useArrows : true,
						// 设置为true将在树中使用Vista-style的箭头
						region : 'west',// 指定布局
						autoScroll : true,
						animate : true,
						// 设置为true以启用展开/折叠时的动画效果
						containerScroll : true,
						// 设置为true向ScrollManager注册此容器
						border : false,
						rootVisible : false,
						// rootVisible: true,
						// 设置为false将隐藏root节点
						margins : '2 2 0 0',

						root : root,
						dataUrl : '/MenuAction!loadTree.action',
						listeners : {
							'click' : function(node, e) {
								var randomnumber = Math
										.floor(Math.random() * 100000);// 作为地址的传递参数
								// 以使每次访问时重新获取数据
								// 而非缓存中信息
								var tab = Ext.get('tab_' + node.id);
								e.stopEvent();// 停止事件传递
								// 否则会促使浏览器发送URL（菜单链接）向服务器发送请求
								if (node.leaf) {
									if (tab == null) {
										// alert(node.attributes.href);
										var subTabPanel = new Ext.Panel(
												{
													id : 'tab_' + node.id,
													title : node.text,
													closable : true,
													html : '<iframe id="iframe_'
															+ node.id
															+ '" name="iframe_'
															+ node.id
															+ '" scrolling="auto" frameborder="0" width="100%" height="100%" src="'
															+ node.attributes.href
															+ "?random="
															+ randomnumber
															+ '"></iframe>'
												});
										tabPanel.add(subTabPanel);// 添加该panel

										tabPanel.setActiveTab('tab_' + node.id);// 激活它

									} else {
										tabPanel.setActiveTab("tab_" + node.id);// 如果已经存在
										// 则激活它
									}

								}
							}
						}

					});
			
			//第三部分

			var tabPanel = new Ext.TabPanel({
				region : 'center',
				enableTabScroll : true,
				border : true,
				activeTab : 0,
                items:[{
                    title:"车辆监控",
                    closable:true,
                    html:"<iframe scrolling='auto' frameborder='0' width='100%' height='100%' src='http://localhost:8080/map.jsp'> </iframe>"
                }],
			});


			// 初始化页面Layout
			var viewport = new Ext.Viewport({
				layout : 'border',

				items : [ headerPanel, menuTree,tabPanel]
			});
			

		});