// 存取数据,自己封装的方法;
var store = {
    // 存储
    save (key,value) {
        localStorage.setItem(key,JSON.stringify(value))
    },
    // 获取
    fetch (key) {
        return JSON.parse(localStorage.getItem(key))||[]
    }
};

// var lists = [
//     {
//         title: "吃饭睡觉",
//         checked: true,
//     },
//     {
//         title: "打豆豆",
//         checked: false,
//     },
// ];

var list = store.fetch("getList");

var vm = new Vue({
    el: ".main",
    data: {
        list: list,
        // 能不去操作DOM尽量不去操作DOM
        todo: "",
        //记录正在编辑的信息
        edtorTodos: "",
        // 更改标题之前记录原标题
        beforTitle: "",
        // 通过这个属性值变化对数据进行筛选
        filters: "all",
    },
    // 监控list属性,当这个值发生变化,就会执行函数,保存数据
    watch: {
        /*list: function () {
            store.save("getList",this.list);
            {deep:true}
        },*/
        list: {
            handler: function () {
                store.save("getList",this.list);
            },
            deep:true,
        }
    },
    computed: {
        noCheckedLength: function () {
            return this.list.filter(
                function (val) {
                    return !val.checked
                }
            ).length
        },
        hashfilter: function () {
            // 过滤的三种情况
            var filter = {
                all: function (list) {
                    return list;
                },
                unfinished: function (list) {
                    return list.filter(
                        function (item) {
                            return item.checked
                        }
                     )
                },      
                accomplish: function () {
                    return list.filter(
                        function (item) {
                            return !item.checked
                        }
                     )
                }
            }
            // 找到了过滤函数就返回过滤后的数据,否则返回所有数据    
            return filter[this.filters] ? filter[this.filters](list) : list;
        }
        
    },
    methods: {
        // 添加任务事件
        addTodo (ev) {
            // console.log(ev.target)
            // this.list.push({
            //     title: ev.target.value,
            // }),
            // ev.target.value = ''

            this.list.push(
                {
                    title: this.todo,
                    checked: false,
                }
            );
            this.todo = "";
        },

        // 删除任务事件
        deleteTodo (todo) {
            var index = this.list.indexOf(todo);
            this.list.splice(index,1);
        },
        // 编辑任务事件
        EditData (todo) {
            //  console.log(todo)

            // 编辑任务的时候,先记录这条任务的title,方便在取消编辑的时候重新给
            // 之前的title,一切用是数据编辑;
            this.beforTitle = todo.title;
            this.edtorTodos = todo;
        }, 
        // 确定编辑任务事件
        endedtorTodos (todo) {
            this.edtorTodos = "";
        },
        // 取消编任务事件
        esctodo (todo) {
            console.log(this.beforTile);
            todo.title = this.beforTitle;
            // 记录的值已经没用了,清空
            this.beforeTitle = '';
            // // 让div显示,input隐藏
            this.edtorTodos ="";
        }
    },
    // 自定义指令
    directives: {
        "focus": {
            update (el,binding) {
                if(binding.value) {
                    el.focus();
                }
            }
        }
    },
});

function hashs() {
    var hash = window.location.hash.slice(1);
    // console.log(hash);
    vm.filters = hash;
};

window.addEventListener("hashchange",hashs);