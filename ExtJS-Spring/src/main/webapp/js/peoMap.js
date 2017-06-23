Ext.onReady(function() {
			Ext.QuickTips.init();

			// 表头
			var headerpanel = new Ext.Panel({
				title : '<marquee width="400px">This is ext</marquee>',
				region : 'north',
				xtype : 'panel',
				spilt : true,
				height : 50,
				html : '<p>GPS导航业务</p>',
			});
			
			
			var map = new BMap.Map("container");
			var point = new BMap.Point(116.400244,39.92556);
			map.centerAndZoom(point, 12);
			var marker = new BMap.Marker(point);  // 创建标注
			map.addOverlay(marker);              // 将标注添加到地图中

			var label = new BMap.Label("我是文字标注哦",{offset:new BMap.Size(20,-10)});
			marker.setLabel(label);
			// 中间工作栏
			var tabPanel = new Ext.TabPanel(
					{
						title : '中间曾',
						region : 'center',
						xtype : 'panel',
						el : 'container',
						html : '<iframe frameborder="0" marginheight="0" width="100%" height="100%" marginwidth="0" scrolling="auto" name="ifrMID">ceshi</iframe>',
					/*
					 * items : [ { title : '实时监控' } ]
					 */

					});
			// 右侧工作栏
			var tabPanel2 = new Ext.TabPanel({
				region : 'east',
				enableTabScroll : true,
				activeTab : 0,
				width : 300,
				html : '<p>GPS导航业务右侧工作栏</p>',
				items : [ {
					title : '监控信息'
				} ]
			});
			// 底端模块
			var tabPanelS = new Ext.Panel({
				title : '底端模块',
				region : 'south',
				height : 150,
				frame:true,
				collapsible:'true',
				bodyPadding:5,
				items : [{
					title:'车辆监控',
					autoLoad:'data.html'
				}]
			});

			// 初始化页面Layout
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [tabPanel, tabPanel2, tabPanelS ]
			});

		});