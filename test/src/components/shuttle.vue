<template>
    <div>
        <!-- 穿梭 -->
        <div class="div_shuttle">
            <div style="text-align: center" class="shuttle" v-if="data.length!==0" v-for="(item,index) in data" :key=index >
        
                <el-transfer
                style="text-align: left;"
                v-model="select[index]"
                filterable v-filter
                :left-default-checked="[]" 
                :right-default-checked="[]"
                :titles="[`属性类型：${item.title}`, '已选属性']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                @change="handleChange"
                :data="item.data">
                </el-transfer>
            </div>
        </div>
    </div>
</template>


<script>
  export default {
    data() {
      return {
        // 假数据
        data_config: {
          list:[
              {
                title:'产品属性1',
                id:1,
                data:[
                  {label:'joker_1_1',id:'1'},
                  {label:'joker_1_2',id:'2'},
                  {label:'joker_1_3',id:'3'},
                  {label:'joker_1_4',id:'4'},
                  {label:'joker_1_5',id:'5'},
                  {label:'joker_1_6',id:'6'},
                  {label:'joker_1_7',id:'7'},
                  {label:'joker_1_8',id:'8'},
                ]
            },
            {
              title:'产品属性2',
              id:2,
              data:[
                {label:'joker_2_1',id:'1'},
                {label:'joker_2_2',id:'2'},
                {label:'joker_2_3',id:'3'},
                {label:'joker_2_4',id:'4'},
                {label:'joker_2_5',id:'5'},
                {label:'joker_2_6',id:'6'},
                {label:'joker_2_7',id:'7'},
              ]
            },
          ]
        },
        data:[], 
        select: [], // 选中的值
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        }
      }
    },
    methods: {
      /**
       * joker
       * 监听穿梭的值
       * @param string value     当前值
       * @param string direction 数据移动的方向（'left' / 'right'）
       * @param number movedKeys 发生移动的数据 key 数组
       */
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
        //处理数据结构
        let data = this.arrange_data(this.select);
        //传递信息
        this.$emit('up_submit',data);
      },
      
      /**
       * joker
       * 数据初始化
       */
      getdata(){
        this.data_config.list.map((itmes,indexs,arrs)=>{ 
            //添加选中数组的索引
            this.select.push([]);
            //整理数据
            this.data.push(
              {
                title:itmes.title,
                id:itmes.id,
                data:
                  itmes.data.map((itme,index,arr)=>{
                      return {
                          key: index,
                          label: ` ${ itme.label }`,
                          disabled: index % 4 === 0  // 是否余数为0
                    }
                 })
              }
            );
        });
      },

      /**
       * joker
       * 提交之前，数据整理
       * @param array arr 确定提交的数据
       */
      arrange_data(arr){
          var data =[];
          var that =this;
          if(arr.length!==0){
              arr.map((itmes,index,arrs)=>{ 
                //判断数组中是否有元素
                  if(itmes.length!==0){
                      // 数组是否存在值,存在则
                      data.push(
                            [
                              { 
                                title:that.data_config.list[index].title,
                                id:that.data_config.list[index].id, 
                                list:
                                  itmes.map((itme,inx,arr)=>{ 
                                        return that.data_config.list[index].data[itme];
                                  })
                              }
                            ]
                        )
                    }
              })
            };
          return data;
      }
      
    },
    mounted(){
        // 加载假数据
        this.getdata();
    },
  }
</script>
<style lang="postcss" scoped>
    /deep/ .transfer-footer {
        margin-left: 20px;
        padding: 6px 5px;
    }
    .div_shuttle{
        margin-bottom: 90px;
    }
   /deep/ .el-transfer-panel{
        width: 45%;
    }
    /deep/ .el-transfer-panel__body , /deep/ .el-transfer-panel__list.is-filterable{
            height: 400px;
    }
    .shuttle{
        margin-top: 15px;
    }
    
    /deep/ .el-checkbox-group label{
        float: left;
    }
</style>
