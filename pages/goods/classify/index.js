const App = getApp()
//var list =require('list.js')
var util = require('../../../helpers/Md5.js')    // 引入md5.js文件
Page({
    data: {
      classify: {},
      prompt: {
          hidden: !0,
      },
      pid:'',
      show: 'block',
      hide: 'none',
      total:1,
      nums:1,
      img_path:'',
      hideModal: true, //模态框的状态  true-隐藏  false-显示
      animationData: {},//
      list: {
        'A': [
          { 'name': '新鲜水果44' },
          { 'picture': '/pages/tttt/img/demo1.png', 'desc': '葡萄酒' },
          { 'picture': '../../img/56668c04N5cb325b7.jpg', 'desc': '洋酒' },
          { 'picture': '../../img/586e055eNf678fd52.png', 'desc': '汾酒' },
          // { 'picture': '../../img/596d6f4eNb62c24c1.jpg', 'desc': '汾酒' }
        ],
        'B': [
          { 'name': '时令蔬菜' },
          { 'picture': '../../img/55ac9689Ncc876cf1.jpg', 'desc': '葡萄酒' },
          { 'picture': '../../img/56668c04N5cb325b7.jpg', 'desc': '洋酒' },
          { 'picture': '../../img/586e055eNf678fd52.png', 'desc': '汾酒' },
          { 'picture': '../../img/586e055eNf678fd52.png', 'desc': '汾酒' },
          { 'picture': '../../img/586e055eNf678fd52.png', 'desc': '汾酒' },
          { 'picture': '../../img/596d6f4eNb62c24c1.jpg', 'desc': '汾酒' }
        ]
      },
        // 左侧点击类样式
        curNav: 'A',
        scrollTop: 0,
        // 定义一个空数组，用来存放右侧滑栏中每一个商品分类的 Height
        listHeight: ''
    },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    console.log(55555555555555)
    var that = this;
    // 定义右侧标题的 rpx 高度 和 px 高度
    var right_titleRpxHeight = 60;
    var right_titleHeight;
    // 定义右侧单个商品的 rpx 高度 和 px 高度
    var right_contentRpxHeight = 180;
    var right_contentHeight;
    // 定义左侧单个tab的 rpx 高度 和 px 高度
    var left_titleRpxHeight = 140;
    var left_titleHeight;
    //  获取可视区屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        // percent 为当前设备1rpx对应的px值
        var percent = res.windowWidth / 750;
        that.setData({
          winHeight: res.windowHeight,
          right_titleHeight: Number(right_titleRpxHeight * percent),
          right_contentHeight: Number(right_contentRpxHeight * percent),
          left_titleHeight: Number(left_titleRpxHeight * percent)
        })
      }
    })
    // 把请求到的 list 中的数据赋值给  listChild1
    var listChild1 =this.data.list//list.List[0];
    // 定义一个 names ，用于存放 scroll-into-view 使用的 id
    var names = '';
    // 循环 listChild1 中的每一项
    for (var item in listChild1) {
      // 把 listChild1 中每一项的键值用“：”（便于后期处理）分隔开，存入 names 中，数据格式见图‘names中的数据’
      names += ":" + item;
      // 计算右侧每一个分类的 Height 。
      // listChild1 下的每一个 item 中包含该分类的 title，所以 listChild1[item].length 需要减一 
      // 右侧每一个分类中每一行放两个商品，所以 this.data.right_contentHeight 除二
      // 最后加上 right_titleHeight，此时 height 为右侧一个完整分类的高度
      var height = (listChild1[item].length - 1) * this.data.right_contentHeight / 2 + this.data.right_titleHeight;
      // 同上面 names 的道理，把每一个 height 用“：”隔开放入 listHeight 中
      this.data.listHeight += ":" + height;
      this.setData({
        // 把 listChild1 赋值给 list ，供 wxml 中循环使用
        list: listChild1,
        listHeight: this.data.listHeight
      })
    }
    // 把 names 的数据切成数组
    var names = names.substring(1).split(':');
    this.setData({
      names: names
    })
  },
  // 右侧滑栏的 bindscroll 事件函数（ES6写法）
  scroll(event) {
    // 把 listHeight 切割成数组
    var height = this.data.listHeight.substring(1).split(':');
    // 定义一个 index 供左侧边栏联动使用
    var index = 1;
    var num = 0;
    for (var i = 0; i < height.length; i++) {
      // 累计右侧滑栏滚动上去的每一个分类的 Height
      num += parseInt(height[i]);
      // 循环判断 num 是否大于右侧滑栏滚动上去的 Height ，然后 get 到 i 值赋给 index
      if (num > event.detail.scrollTop) {
        index = i + 1;
        // 如果右侧滑栏滚动高度小于单个类别高度的 1/2 时，index 为 0
        if (event.detail.scrollTop < height[0] / 2) {
          index = 0;
        }
        break;
      }
    }
    // 定义并设置左侧边栏的滚动高度
    var left_scrollTop = this.data.left_titleHeight * index
    this.setData({
      scrollTop: left_scrollTop,
      // 动态给左侧滑栏传递对应该项的 id，用于高亮效果显示
      curNav: this.data.names[index]
    })
  },
  //点击左侧 tab ，右侧列表相应位置联动 置顶
  switchRightTab: function (e) {
    var id = e.target.id;
    console.log(id)
    this.setData({
      scrollTopId: id,
      // 左侧点击类样式
      curNav: id,
    })
  },
  onLoad(options) {
    const pid = options.cate_id
    var _self = this
      wx.request({
        url: 'https://mini.gfdbm.com/app.php',
        method: "GET",
        // 请求头部
        header: {
          'content-type': 'application/text'
        },
        data: {
          m: 'App',
          c: 'api',
          a: 'processing',
          requestData: { "pack_no": "20010", "date": "1453433081", "user_id": "29a19\/vIvTNq27jFuUVhxo7A2bQNjeK|jia|Q\/BAn1\/MGDM", "deviceId": "357143046443542", "token": "c8a626153823660b876ec4e549b8463e", "roles": "", "data": { "name": "11", "title": "11", "member_name": "1112", "nums": "123456",'pid':pid } },
        },
        success: function (res) {
          _self.setData({
            list: res.data.data.List,
            img_path:res.data.data.img_path
          })
        }
      })
    },
  onShow(options) {
    const pid = options.cate_id
    var _self = this
    wx.request({
      url: 'https://mini.gfdbm.com/app.php',
      method: "GET",
      // 请求头部
      header: {
        'content-type': 'application/text'
      },
      data: {
        m: 'App',
        c: 'api',
        a: 'processing',
        requestData: { "pack_no": "20010", "date": "1453433081", "user_id": "29a19\/vIvTNq27jFuUVhxo7A2bQNjeK|jia|Q\/BAn1\/MGDM", "deviceId": "357143046443542", "token": "c8a626153823660b876ec4e549b8463e", "roles": "", "data": { "name": "11", "title": "11", "member_name": "1112", "nums": "123456", 'pid': pid } },
      },
      success: function (res) {
        _self.setData({
          list: res.data.data.List,
          img_path: res.data.data.img_path
        })
      }
    })
    },
    initData() {
        this.setData({
            classify: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/list/index', {
            type: e.currentTarget.dataset.id
        })
    },
    getClassify() {
        const classify = this.data.classify
        const params = classify.params

        // App.HttpService.getClassify(params)
        /*
        this.classify.queryAsync(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                classify.items = [...classify.items, ...data.data.items]
                classify.paginate = data.data.paginate
                classify.params.page = data.data.paginate.next
                classify.params.limit = data.data.paginate.perPage
                this.setData({
                    classify: classify,
                    'prompt.hidden': classify.items.length,
                })
            }
        })
        */
    },
    onPullDownRefresh() {
        this.initData()
        this.getClassify()
    },
    onReachBottom() {
        this.lower()
    },
    lower() {
        if (!this.data.classify.paginate.hasNext) return
        this.getClassify()
    },
    goTo(e){
      const url = e.currentTarget.dataset.url
      App.WxService.navigateTo(url)
    },
  showModal: function (e) {
    // 显示遮罩层
    const item_info = e.currentTarget.dataset
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      item_id: item_info.id,
      total: 1,
      item_name: item_info.name,
      item_price: item_info.price,
      img_url: item_info.url,
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  addCart(e) {
    const timestamp = Date.parse(new Date());
    const key = App.Tools.rand_key()
    const _self = this
    const goods = this.data.item_id
    const uid = App.WxService.getStorageSync('user_id')
    const pack_no = "20013"
    const token = util.hexMD5(pack_no + uid + timestamp + key);  // 使用加密
    App.HttpService.addCartByUser(
      {
        requestData: {
          "pack_no": pack_no,
          "date": timestamp,
          "user_id": uid,
          "deviceId": "357143046443542",
          "token": token,
          "roles": "",
          "data":
          {
            "item_id": _self.data.item_id,
            "price": _self.data.item_price,
            "nums": _self.data.total,
          }
        }
      }
    )
      .then(data => {
        console.log(data)
        if (data.status.code == '000') {
          this.showToast(data.data.msg)
          _self.setData({
            total: data.data.total
          })
          this.hideModal()
        }
      })
  },

  increase: function (e) {
    var total = e.currentTarget.dataset.total;
    this.setData({
      total: parseInt(total) + 1
    })
  },

  decrease: function (e) {
    var total = e.currentTarget.dataset.total;
    if (total >= 2) {
      this.setData({
        total: parseInt(total) - 1
      })
    }
  },

  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 1500,
    })
  },
})