Ext.onReady(function() {
    Ext.QuickTips.init();
    var map=new BMap.Map("container");//  创建Map实例  
    var point = new BMap.Point(113.666419,34.754674);
    map.centerAndZoom(point, 12); //  初始化地图,设置中心点坐标和地图级别  
    map.enableScrollWheelZoom(); // 启用滚轮放大缩小 
    //map.setCurrentCity("南京");

    //创建数据集
    var store1 = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : '/api/realtime/orgResource',
            type : 'ajax'
        }),
        reader : new Ext.data.JsonReader(
            {
                root:'entity',
                type:'json'
            },[
                {name : 'orgs',mapping:'org.orgName'},
                {name : 'positionLati',mapping:'org.position.latitude'},
                {name : 'positionLong',mapping:'org.position.longitude'},
                {name : 'ambuOut',mapping:'ambulanceResource.resourceOutNumber'},
                {name : 'ambuRemain',mapping:'ambulanceResource.resourceRemainNumber'},
                {name : 'totalNumber',mapping:'ambulanceResource.resourceTotalNumber'}
            ]),
        listeners:{
            load:function(){
               for(var i=0;i<this.getCount();i++){
                   if(this.getAt(i).get("totalNumber")=='0'){
                       this.getAt(i).set('ambuOut','0');
                       this.getAt(i).set('ambuRemain','0');
                   }
               }
            }},
        autoLoad : true,
    });
    //加载数据集
   /* store1.load({
        callback:function(records, options, success){
            alert("shujuliang:"+this.getCount());
            for(var i=0;i<this.getCount();i++){
                var text=this.getAt(i).get('orgs')+'外出车辆'+this.getAt(i).get('ambuOut')+',剩余车辆'+this.getAt(i).get('ambuRemain');
                var lati=this.getAt(i).get('positionLati');
                var lonti=this.getAt(i).get('positionLong');
                //标注地图点
                var marker = addMarker(new window.BMap.Point(lonti,lati));
                var label = new BMap.Label(text,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);
            };
        }
    });*/

   //定时器
    var task={
        run:function () {
            store1.reload({
                //params:{start:0,limit:10},
                callback:function() {
                   // alert("store开始刷新");
                   // alert("地图标记shumu :"+this.getCount());
                    for (var i = 0; i < this.getCount(); i++) {
                        var text = this.getAt(i).get('orgs') +'共有车辆'+this.getAt(i).get('totalNumber')+ '外出车辆' + this.getAt(i).get('ambuOut') + ',剩余车辆' + this.getAt(i).get('ambuRemain');
                       //alert("text:"+text);
                        var lati = this.getAt(i).get('positionLati');
                       // alert("latitute"+lati);
                      var lonti = this.getAt(i).get('positionLong');
                        //alert("longtitute"+lonti);
                        //标注地图点
                        //var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157));
                        //var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
                       // map.addOverlay(marker2);              // 将标注添加到地图中
                        var marker = addMarker(new window.BMap.Point(lonti, lati));
                        //map.addOverlay(marker);
                        var label = new BMap.Label(text, {offset: new BMap.Size(20, -10)});
                        marker.setLabel(label);
                    }
                }
            })
        },
        interval:5000,
        scope:this
    };

    Ext.TaskMgr.start(task);



    // 编写自定义函数,创建标注

    function addMarker(point){
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        return marker;
    }

    // 中间工作栏
    var tabPanel = new Ext.TabPanel(
        {
            title : '中间曾',
            region : 'center',
            xtype : 'panel',
            el : 'container',
            html : '<iframe frameborder="0" marginheight="0" width="100%" height="100%" marginwidth="0" scrolling="auto" name="ifrMID"></iframe>',

        });



    // 右侧工作栏....................................
    //创建数据集
    var store2 = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : '/api/realtime/originalRecord',
            type : 'ajax'
        }),
        reader : new Ext.data.JsonReader(
            {
                root:'entity',
                type:'json'
            },[
                {name : 'readerId'},
                {name : 'recordId'},
                {name : 'rfidTag'},
                {name : 'storeTime'}
            ]),
        autoLoad : true,
       listeners:{
            load:function(){
                //alert("原始记录数目："+store2.getCount());//打印测试
            }
        }
    });
    var task2={
        run:function(){
            store2.reload({
                callback:function(){
                    //alert("记录数"+this.getCount());
                }
            })
        },
        interval:20000,
        scope:this
    };
    Ext.TaskMgr.start(task2);//测试结果正常。
    var grid = new Ext.grid.EditorGridPanel({
        width : 500,
        height:200,
        viewConfig:{
            forceFit:true,
            stripeRows:true
        },
        columns : [ {
            header : "id",
            dataIndex : "recordId",
            sortable : true
        }, {
            header : "读卡器id",
            dataIndex : "readerId",
            sortable : true
        }, {
            header : "rfidTag",
            dataIndex : "rfidTag",
            sortable : true
        }, {
            header : "存储时间",
            dataIndex : "storeTime",
            sortable : true,
            renderer : function(value) {
                if (value == null || value == 0) {
                    return 'null'
                } else {
                    return Ext.util.Format.date(new Date(parseInt(value)),
                        'Y-m-d H:i:s')
                }
            },
        }],
        store : store2,
        autoExpandColumn : 2
    });
    var tabPanel2 = new Ext.Panel({
        title:'异常界面',
        frame:'true',
        //collapsible:'true',
        region : 'east',
        width : 500,
        collapsed :true,
        collapsible:true,
        bodyPadding:5,
        layout:'vbox',
        defaults:{
            collapsible:true,
            width:500,
            autoScroll:true
        },
        items : [{
            title:'异常记录',
            height:200,
           // contentEl:'localElement'
        },{
            title:'原始数据',
            layout:"form",
            items:[grid]
        }]
    });


    // 底端模块........................................................

    //创建数据集
    var store3 = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url : '/api/realtime/event1',
            type : 'ajax'
        }),
        reader : new Ext.data.JsonReader(
            {
                root:'entity',
                type:'json'
            },[
                {name : 'event'}
            ]),

        listeners:{
            load:function(){
                //alert("车辆事件数目："+store2.getCount());//打印测试
            }
        },
        autoLoad : true,
    });


    var task3={
        run:function(){
            store3.reload({
                callback:function(){
                    // alert("事件刷新"+this.getCount()+"次"+"/20s")
                }
            })
        },
        interval:20000,
        scope:this
    };
    Ext.TaskMgr.start(task3);//测试结果正常。
    var grid2= new Ext.grid.EditorGridPanel({
        height : 150,

        viewConfig:{
            forceFit:true,
            stripeRows:true
        },
        columns : [ {
            header : "事件类型",
            dataIndex : "event",
            sortable : true,
            editor : false
        }],
        store : store3,
        autoExpandColumn : 2
    });
    var tabPanelS = new Ext.Panel({
       // title : '底端模块',
        region : 'south',
        height : 150,
        collapsible:true,
        frame:true,
        collapsed :true,
        bodyPadding:5,
        //html : '<p>GPS导航业务底部工作栏</p><tr><td>${name}</td></tr>',
        items : [{
            //title:'车辆事件监控',
            layout:"form",
            items:[grid2]
        }]
    });

    // 初始化页面Layout
    var viewport = new Ext.Viewport({
        layout : 'border',
        items : [tabPanel, tabPanel2, tabPanelS]
    });

});