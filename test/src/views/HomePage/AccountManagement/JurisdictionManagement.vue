<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo'>
                    <div style="position: absolute;bottom: -37px;left: 260px;">
                        <el-button size="small" type="primary" style="padding:9px 18px;" :disabled="user_id==''?true:false" round @click="handleManageUserJurisdiction">保存</el-button>
                    </div>
                </ComSearchCondition>
                <div class="jurisdictionMainInfo">
                    <template>
                        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                            <el-tab-pane label="数据显示权限" name="dataDisplay">
                                <div class="jurisdictionList" v-show="showTab">
                                    <el-container>
                                        <el-header>账号列表</el-header>
                                        <el-main>
                                            <div class="scroll" id="accountList1" @scroll="handleScroll('1','accountList',$event)">
                                                <div class="jurisdictionMax" v-for="(itme,key,index) in dataShowPermissionObj.accountList">
                                                    <div class="jurisdictionHeadStyle" :key="key+'data1'">
                                                        <div class="oneLevelIcon" @click="handleClickRetractable(index,key,'accountList','1',$event)"><i class="el-icon-minus" :id="key+index+'accountList1'"></i></div>
                                                        <div style="padding:0 10px;line-height:15px;"><label :for="key+'data1'">{{key}}</label></div>
                                                        <input type="checkbox" :checked="checkedShow(key,'1','account_id',key)" :id="key+'data1'" style="margin:0;"  @change="handleCheckList(key,key,'data','1')"/>
                                                    </div>
                                                    <div class="dottedLine" :id="key+'accountList1'">
                                                        <div class="jurisdictionStyle" v-for="(twoLevel,index) in itme" :key="twoLevel.id+'data1'">
                                                            <span class="twoLevelDottedLine">- - - - -</span>
                                                            <div class="twoLevelJurisdiction"><label :for="twoLevel.id+'data1'"> {{twoLevel.account_name}}</label>
                                                                <input type="checkbox" :checked="checkedShow(twoLevel.id,'1','account_id',key)" class="twoLevelCheckbox" :id="twoLevel.id+'data1'"  @change="handleCheckList(twoLevel.id,key,'data','1')"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                    </el-container>
                                </div>
                                <div class="jurisdictionList" v-show="showTab">
                                    <el-container>
                                        <el-header>产品线分类列表</el-header>
                                        <el-main>
                                            <div class="scroll" id="proLine1" @scroll="handleScroll('1','proLine',$event)">
                                                <div class="jurisdictionMax" v-for="(itme,key,index) in dataShowPermissionObj.proLine">
                                                    <div class="jurisdictionHeadStyle" :key="key+'products1'">
                                                        <div class="oneLevelIcon" @click="handleClickRetractable(index,key,'proLine','1',$event)"><i class="el-icon-minus" :id="key+index+'proLine1'"></i></div>
                                                        <div style="padding:0 10px;line-height:15px;"><label :for="key+'product1'">{{itme.name}}</label></div>
                                                        <input type="checkbox"  :checked="checkedShow(key,'1','pro_line_id','',key)" :id="key+'product1'" style="margin:0;"  @change="handleCheckList(key,'','product','1',key)"/>
                                                    </div>
                                                    <div class="dottedLine" :id="key+'proLine1'">
                                                        <div v-for="(twoLevel,twoLevelKey) in itme.items" :key="twoLevelKey+'products1'">
                                                            <div class="jurisdictionStyle">
                                                                <span class="twoLevelDottedLine">- - - - -</span>
                                                                <div class="twoLevelJurisdiction"><label :for="twoLevelKey+'product1'"> {{twoLevel.name}}</label>
                                                                    <input type="checkbox"  :checked="checkedShow(twoLevelKey,'1','pro_line_id','',key)" class="twoLevelCheckbox" :id="twoLevelKey+'product1'"  @change="handleCheckList(twoLevelKey,'','product','1',key)"/>
                                                                </div>
                                                            </div>
                                                            <div v-for="(threeLevel,threeLevelKey) in twoLevel.items" :key="threeLevelKey+'products1'">
                                                                <div class="jurisdictionStyle">
                                                                    <span class="twoLevelDottedLine">- - - - - - - -</span>
                                                                    <div class="twoLevelJurisdiction"><label :for="threeLevelKey+'product1'"> {{threeLevel.name}}</label>
                                                                        <input type="checkbox" :checked="checkedShow(threeLevelKey,'1','pro_line_id','',key,twoLevelKey)" class="twoLevelCheckbox" :id="threeLevelKey+'product1'"  @change="handleCheckList(threeLevelKey,'','product','1',key)"/>
                                                                    </div>
                                                                </div>
                                                                <div v-for="(fourLevel,fourLevelKey) in threeLevel.items" :key="fourLevelKey+'products1'">
                                                                    <div class="jurisdictionStyle">
                                                                        <span class="twoLevelDottedLine">- - - - - - - - - -</span>
                                                                        <div class="twoLevelJurisdiction"><label :for="fourLevelKey+'product1'"> {{fourLevel.name}}</label>
                                                                            <input type="checkbox" :checked="checkedShow(fourLevelKey,'1','pro_line_id','',key,twoLevelKey,threeLevelKey)" class="twoLevelCheckbox" :id="fourLevelKey+'product1'"  @change="handleCheckList(fourLevelKey,'','product','1',key)"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                    </el-container>
                                </div>
                                <div class="jurisdictionList" v-show="showTab">
                                    <el-container>
                                        <el-header>邮件分类列表</el-header>
                                        <el-main>
                                            <div class="scroll" id="tagList1" @scroll="handleScroll('1','tagList',$event)">
                                                <div class="jurisdictionMax" v-for="(itme,key,index) in dataShowPermissionObj.tagList">
                                                    <div class="jurisdictionHeadStyle" :key="key+'box1'">
                                                        <div class="oneLevelIcon" @click="handleClickRetractable(index,key,'tagList','1',$event)"><i class="el-icon-minus" :id="key+index+'tagList1'"></i></div>
                                                        <div style="padding:0 10px;line-height:15px;"><label :for="key+'box1'">{{itme.name}}</label></div>
                                                        <input type="checkbox" :checked="checkedShow(key,'1','tag_id','',key)" :id="key+'box1'" style="margin:0;"  @change="handleCheckList(key,'','box','1',key)"/>
                                                    </div>
                                                    <div class="dottedLine" :id="key+'tagList1'">
                                                        <div v-for="(twoLevel,twoLevelKey) in itme.item" :key="twoLevelKey+'box1'">
                                                            <div class="jurisdictionStyle">
                                                                <span class="twoLevelDottedLine">- - - - -</span>
                                                                <div class="twoLevelJurisdiction"><label :for="twoLevelKey+'box1'"> {{twoLevel.name}}</label>
                                                                    <input type="checkbox" :checked="checkedShow(twoLevelKey,'1','tag_id','',key)" class="twoLevelCheckbox" :id="twoLevelKey+'box1'"  @change="handleCheckList(twoLevelKey,'','box','1',key)"/>
                                                                </div>
                                                            </div>
                                                            <div v-for="(threeLevel,threeLevelKey) in twoLevel.item" :key="threeLevelKey+'box1'">
                                                                <div class="jurisdictionStyle">
                                                                    <span class="twoLevelDottedLine">- - - - - - - -</span>
                                                                    <div class="twoLevelJurisdiction"><label :for="threeLevelKey+'box1'"> {{threeLevel.name}}</label>
                                                                        <input type="checkbox" :checked="checkedShow(threeLevelKey,'1','tag_id','',key,twoLevelKey)" class="twoLevelCheckbox" :id="threeLevelKey+'box1'"  @change="handleCheckList(threeLevelKey,'','box','1',key)"/>
                                                                    </div>
                                                                </div>
                                                                <div v-for="(fourLevel,fourLevelKey) in threeLevel.item" :key="fourLevelKey+'box1'">
                                                                    <div class="jurisdictionStyle">
                                                                        <span class="twoLevelDottedLine">- - - - - - - - - -</span>
                                                                        <div class="twoLevelJurisdiction"><label :for="fourLevelKey+'box1'"> {{fourLevel.name}}</label>
                                                                            <input type="checkbox" :checked="checkedShow(fourLevelKey,'1','tag_id','',key,twoLevelKey,threeLevelKey)" class="twoLevelCheckbox" :id="fourLevelKey+'box1'"  @change="handleCheckList(fourLevelKey,'','box','1',key)"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                    </el-container>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="任务分配权限" name="taskDistribution">
                                <div class="jurisdictionList" v-show="!showTab">
                                    <el-container>
                                        <el-header>账号列表</el-header>
                                        <el-main>
                                            <div class="scroll" id="accountList2" @scroll="handleScroll('2','accountList',$event)">
                                                <div class="jurisdictionMax" v-for="(itme,key,index) in taskAssignmentPermissions.accountList">
                                                    <div class="jurisdictionHeadStyle" :key="key+'data2'">
                                                        <div class="oneLevelIcon" @click="handleClickRetractable(index,key,'accountList','2',$event)"><i class="el-icon-minus" :id="key+index+'accountList2'"></i></div>
                                                        <div style="padding:0 10px;line-height:15px;"><label :for="key+'data2'">{{key}}</label></div>
                                                        <input type="checkbox" :id="key+'data2'" :checked="checkedShow(key,'2','account_id',key)" style="margin:0;"  @change="handleCheckList(key,key,'data','2')"/>
                                                    </div>
                                                    <div class="dottedLine" :id="key+'accountList2'">
                                                        <div class="jurisdictionStyle" v-for="(twoLevel,index) in itme" :key="twoLevel.id+'data2'">
                                                            <span class="twoLevelDottedLine">- - - - -</span>
                                                            <div class="twoLevelJurisdiction"><label :for="twoLevel.id+'data2'"> {{twoLevel.account_name}}</label>
                                                                <input type="checkbox" :checked="checkedShow(twoLevel.id,'2','account_id',key)" class="twoLevelCheckbox" :id="twoLevel.id+'data2'"  @change="handleCheckList(twoLevel.id,key,'data','2')"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                    </el-container>
                                </div>
                                <div class="jurisdictionList" v-show="!showTab">
                                    <el-container>
                                        <el-header>产品线分类列表</el-header>
                                        <el-main>
                                            <div class="scroll" id="proLine2" @scroll="handleScroll('2','proLine',$event)">
                                                <div class="jurisdictionMax" v-for="(itme,key,index) in taskAssignmentPermissions.proLine">
                                                    <div class="jurisdictionHeadStyle" :key="key+'product2'">
                                                        <div class="oneLevelIcon" @click="handleClickRetractable(index,key,'proLine','2',$event)"><i class="el-icon-minus" :id="key+index+'proLine2'"></i></div>
                                                        <div style="padding:0 10px;line-height:15px;"><label :for="key+'product2'">{{itme.name}}</label></div>
                                                        <input type="checkbox" :checked="checkedShow(key,'2','pro_line_id','',key)" :id="key+'product2'" style="margin:0;"  @change="handleCheckList(key,'','product','2',key)"/>
                                                    </div>
                                                    <div class="dottedLine" :id="key+'proLine2'">
                                                        <div v-for="(twoLevel,twoLevelKey) in itme.items" :key="twoLevelKey+'product2'">
                                                            <div class="jurisdictionStyle">
                                                                <span class="twoLevelDottedLine">- - - - -</span>
                                                                <div class="twoLevelJurisdiction"><label :for="twoLevelKey+'product2'"> {{twoLevel.name}}</label>
                                                                    <input type="checkbox" :checked="checkedShow(twoLevelKey,'2','pro_line_id','',key)" class="twoLevelCheckbox" :id="twoLevelKey+'product2'"  @change="handleCheckList(twoLevelKey,'','product','2',key)"/>
                                                                </div>
                                                            </div>
                                                            <div v-for="(threeLevel,threeLevelKey) in twoLevel.items" :key="threeLevelKey+'product2'">
                                                                <div class="jurisdictionStyle">
                                                                    <span class="twoLevelDottedLine">- - - - - - - -</span>
                                                                    <div class="twoLevelJurisdiction"><label :for="threeLevelKey+'product2'"> {{threeLevel.name}}</label>
                                                                        <input type="checkbox" :checked="checkedShow(threeLevelKey,'2','pro_line_id','',key,twoLevelKey)" class="twoLevelCheckbox" :id="threeLevelKey+'product2'"  @change="handleCheckList(threeLevelKey,'','product','2',key)"/>
                                                                    </div>
                                                                </div>
                                                                <div v-for="(fourLevel,fourLevelKey) in threeLevel.items" :key="fourLevelKey+'product2'">
                                                                    <div class="jurisdictionStyle">
                                                                        <span class="twoLevelDottedLine">- - - - - - - - - -</span>
                                                                        <div class="twoLevelJurisdiction"><label :for="fourLevelKey+'product2'"> {{fourLevel.name}}</label>
                                                                            <input type="checkbox" :checked="checkedShow(fourLevelKey,'2','pro_line_id','',key,twoLevelKey,threeLevelKey)" class="twoLevelCheckbox" :id="fourLevelKey+'product2'"  @change="handleCheckList(fourLevelKey,'','product','2',key)"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                    </el-container>
                                </div>
                                <div class="jurisdictionList" v-show="!showTab">
                                    <el-container>
                                        <el-header>邮件分类列表</el-header>
                                        <el-main>
                                            <div class="scroll" id="tagList2" @scroll="handleScroll('2','tagList',$event)">
                                                <div class="jurisdictionMax" v-for="(itme,key,index) in taskAssignmentPermissions.tagList">
                                                    <div class="jurisdictionHeadStyle" :key="key+'box2'">
                                                        <div class="oneLevelIcon" @click="handleClickRetractable(index,key,'tagList','2',$event)"><i class="el-icon-minus" :id="key+index+'tagList2'"></i></div>
                                                        <div style="padding:0 10px;line-height:15px;"><label :for="key+'box2'">{{itme.name}}</label></div>
                                                        <input type="checkbox" :checked="checkedShow(key,'2','tag_id','',key)" :id="key+'box2'" style="margin:0;"  @change="handleCheckList(key,'','box','2',key)"/>
                                                    </div>
                                                    <div class="dottedLine" :id="key+'tagList2'">
                                                        <div v-for="(twoLevel,twoLevelKey) in itme.item" :key="twoLevelKey+'box2'">
                                                            <div class="jurisdictionStyle">
                                                                <span class="twoLevelDottedLine">- - - - -</span>
                                                                <div class="twoLevelJurisdiction"><label :for="twoLevelKey+'box2'"> {{twoLevel.name}}</label>
                                                                    <input type="checkbox" :checked="checkedShow(twoLevelKey,'2','tag_id','',key)" class="twoLevelCheckbox" :id="twoLevelKey+'box2'"  @change="handleCheckList(twoLevelKey,'','box','2',key)"/>
                                                                </div>
                                                            </div>
                                                            <div v-for="(threeLevel,threeLevelKey) in twoLevel.item" :key="threeLevelKey+'box2'">
                                                                <div class="jurisdictionStyle">
                                                                    <span class="twoLevelDottedLine">- - - - - - - -</span>
                                                                    <div class="twoLevelJurisdiction"><label :for="threeLevelKey+'box2'"> {{threeLevel.name}}</label>
                                                                        <input type="checkbox" :checked="checkedShow(threeLevelKey,'2','tag_id','',key,twoLevelKey)" class="twoLevelCheckbox" :id="threeLevelKey+'box2'"  @change="handleCheckList(threeLevelKey,'','box','2',key)"/>
                                                                    </div>
                                                                </div>
                                                                <div v-for="(fourLevel,fourLevelKey) in threeLevel.item" :key="fourLevelKey+'box2'">
                                                                    <div class="jurisdictionStyle">
                                                                        <span class="twoLevelDottedLine">- - - - - - - - - -</span>
                                                                        <div class="twoLevelJurisdiction"><label :for="fourLevelKey+'box2'"> {{fourLevel.name}}</label>
                                                                            <input type="checkbox" :checked="checkedShow(fourLevelKey,'2','tag_id','',key,twoLevelKey,threeLevelKey)" class="twoLevelCheckbox" :id="fourLevelKey+'box2'"  @change="handleCheckList(fourLevelKey,'','box','2',key)"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                    </el-container>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import config from "@/assets/js/config";
import {
    dataDisplayList, //默认加载的数据
    updateViewJurisdiction,//获取用户权限
    newAddUserJurisdiction,//新增用户权限
    updateUserJurisdiction,//修改用户权限
} from "../../../api/AccountManagement/jurisdiction_management";
export default {
    name: 'JurisdictionManagement',
    data() {
        return {
            activeName: "dataDisplay",
            dataShowPermissionObj: {//+-数据显示权限
                accountList:{},
                proLine:{},
                tagList:{}
            },
            taskAssignmentPermissions:{//任务分配权限
                accountList:{},
                proLine:{},
                tagList:{}
            },
            allJurisdiction:{},//所有数据
            controlIsIndeterminateOrCheckAll: {},
            isIndeterminate: false,
            checkAll: [],
            dataDislayJurisdiction:{//数据显示权限
                account:[],//账号列表
                product:[],//产品线分类列表
                mailSorting:[],//邮件分类列表
            },
            taskDistributionJurisdiction:{//任务分配权限
                account:[],//账号列表
                product:[],//产品线分类列表
                mailSorting:[],//邮件分类列表
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            action:'',//新增或修改标示符
            delayedRendering:false,//延时渲染
            user_id:'',//存储查询的用户id
            dataChecklist:{//用来存储勾选的数据
                "1": {
                    account_id: {},
                    pro_line_id: [],
                    tag_id: []
                },
                "2": {
                    account_id: {},
                    pro_line_id: [],
                    tag_id: []
                }
            },
            dataChecklistId:{//用来存储所有勾选的数据，包括父级
                "1": {
                    account_id: {},
                    pro_line_id: [],
                    tag_id: []
                },
                "2": {
                    account_id: {},
                    pro_line_id: [],
                    tag_id: []
                }
            },
            storageId:{//用来存储所有id
                "1": {
                    account_id: {},
                    pro_line_id: [],
                    tag_id: []
                },
                "2": {
                    account_id: {},
                    pro_line_id: [],
                    tag_id: []
                }
            },
            showTab:true,
            loadNumber:{
                '1':{
                    accountList:1,
                    proLine:1,
                    tagList:1
                },
                '2':{
                    accountList:1,
                    proLine:1,
                    tagList:1
                }
            },
            dataJurisdiction:'',
            selectionMethod:true,
        };
    },
    methods: {
        dataDisplayList,
        updateViewJurisdiction,
        newAddUserJurisdiction,
        updateUserJurisdiction,
        ...mapActions(["getJurisdictionManagement"]),
        checkedShow(id, identifier, list, platform,key,twoKey,threeKey){
            if(platform){
                if(this.dataChecklistId[identifier][list][platform].length==this.storageId[identifier][list][platform].length)return true;
                if(this.dataChecklistId[identifier][list][platform].indexOf(id)>-1){
                    return true;
                }else{
                    return false;
                }
            }else{
                if(this.dataChecklistId[identifier][list].indexOf(id)>-1){
                    if(this.selectionMethod){
                        let number=0;
                        let line = '',lineItem = '';
                        if(list=='pro_line_id'){
                            line = 'proLine';
                            lineItem = 'items';
                        }else{
                            line = 'tagList';
                            lineItem = 'item';
                        }
                        for (const memu in this.dataShowPermissionObj[line]) {
                            let form={},threeLevel={},fourLevel={};
                            let oneLevelBool=true,twoLevelBool=true,threeLevelBool=true;
                                form = this.dataShowPermissionObj[line][memu][lineItem];
                                if(!form){
                                    key = memu;
                                    continue;
                                }
                            for(const formKey in form){
                                if(twoKey==formKey||id==formKey){
                                    threeLevel = form[formKey][lineItem];
                                    if(!threeLevel){
                                        twoKey = formKey
                                        if(this.dataChecklistId[identifier][list].indexOf(formKey)==-1){
                                            oneLevelBool=false;
                                        }
                                    }
                                }else{
                                    continue;
                                }
                                for(const threeLevelKey in threeLevel){
                                    if(threeLevelKey==threeKey||id==threeLevelKey){
                                        fourLevel = threeLevel[threeLevelKey][lineItem];
                                        if(!fourLevel){
                                            threeKey = threeLevelKey
                                            if(this.dataChecklistId[identifier][list].indexOf(threeLevelKey)==-1){
                                                twoLevelBool=false;
                                            }
                                        }
                                    }else{
                                        continue;
                                    }
                                    for(const fourLevelKey in fourLevel){
                                        if(this.dataChecklistId[identifier][list].indexOf(fourLevelKey)==-1){
                                            threeLevelBool=false;
                                        }
                                    }
                                    if(threeLevelBool){
                                        if(this.dataChecklistId[identifier][list].indexOf(threeKey)==-1){
                                            this.dataChecklistId[identifier][list].push(threeKey)
                                        }
                                    }else{
                                        threeLevelBool=true
                                    }
                                }
                                if(twoLevelBool){
                                    if(this.dataChecklistId[identifier][list].indexOf(twoKey)==-1){
                                        this.dataChecklistId[identifier][list].push(twoKey)
                                    }
                                }else{
                                    twoLevelBool=true
                                }
                            }
                            if(oneLevelBool){
                                if(this.dataChecklistId[identifier][list].indexOf(key)==-1){
                                    this.dataChecklistId[identifier][list].push(key)
                                }
                            }else{
                                oneLevelBool=true
                            }
                        }
                    }
                    return true;
                }else{
                    return false;
                }
            }
        },
        //滚动加载数据
        handleScroll(identifier,list,event,nodeShow,buttomkey,index){
            let height = 0,bool = false;
            let displayShow = '';
            if(event){
                height = event.srcElement.scrollHeight-event.srcElement.clientHeight;//获取剩余高度
                if(height==0)return;
                bool = (event.srcElement.scrollTop+100)>height
            }else{
                height = nodeShow.path[4].scrollHeight-nodeShow.path[4].clientHeight;
                // bool = (nodeShow.path[4].scrollTop+100)>height
            }
            if(bool||nodeShow){
                let number = 0;
                let obj={};
                let temporary = {
                    accountList:{},
                    proLine:{},
                    tagList:{}
                }
                let jurisdiction = this.allJurisdiction[list]
                if(list=='accountList'){
                    if(event)this.loadNumber[identifier].accountList++;
                    let keyArr='',lastKey='';
                    for (const platform in jurisdiction) {
                        let account = jurisdiction[platform]
                        if(document.getElementById(platform+list+identifier))displayShow = document.getElementById(platform+list+identifier).style.display;
                        if(this.dataShowPermissionObj[list][platform]){
                            keyArr = Object.keys(this.dataShowPermissionObj[list][platform])
                            lastKey = keyArr[keyArr.length - 1]
                        }
                        if(displayShow=='none'){
                            displayShow = ''
                            temporary.accountList[platform]={}
                            continue;
                        }
                        // 是否数据计算过
                        let isComputed = true
                        for (const key in account) {
                            number++
                            if (number==(100*this.loadNumber[identifier].accountList))break;
                            obj[key]=account[key]
                        }
                        temporary.accountList[platform] = obj
                        if (number==(100*this.loadNumber[identifier].accountList)){
                            break;
                        } else{
                            obj={};
                        }
                    }
                    if(identifier=='1'){
                        this.dataShowPermissionObj.accountList = temporary.accountList
                    }else{
                        this.taskAssignmentPermissions.accountList = temporary.accountList
                    }
                }else if(list=='proLine'){
                    let keyArr='',lastKey='';
                    if(this.dataShowPermissionObj[list]){
                        keyArr = Object.keys(this.dataShowPermissionObj[list])
                        lastKey = keyArr[keyArr.length - 1]
                    }
                    // 是否数据计算过
                    let isComputed = true
                    this.loadNumber[identifier].proLine++
                    for (const key in jurisdiction) {
                        number++
                        if (key === lastKey) {
                            isComputed = false
                        }
                        if (isComputed) continue;
                        if(key==buttomkey&&displayShow=='none')continue;
                        obj[key] = jurisdiction[key]
                        if (number==2*this.loadNumber[identifier].proLine)break;
                    }
                    obj=JSON.parse(JSON.stringify(obj))
                    this.dataShowPermissionObj[list]=JSON.parse(JSON.stringify(this.dataShowPermissionObj[list]))
                    temporary.proLine= Object.assign(this.dataShowPermissionObj[list],obj)
                    if(identifier=='1'){
                        this.dataShowPermissionObj[list] = temporary.proLine
                    }else{
                        this.taskAssignmentPermissions[list] = temporary.proLine
                    }
                }else if(list=='tagList'){
                    let keyArr='',lastKey='';
                    if(this.dataShowPermissionObj[list]){
                        keyArr = Object.keys(this.dataShowPermissionObj[list])
                        lastKey = keyArr[keyArr.length - 1]
                    }
                    // 是否数据计算过
                    let isComputed = true
                    this.loadNumber[identifier].tagList++
                    for (const key in jurisdiction) {
                        number++
                        if (key === lastKey) {
                            isComputed = false
                        }
                        if (isComputed) continue;
                        if(key==buttomkey&&displayShow=='none')continue;
                        obj[key] = jurisdiction[key]
                        if (number==3*this.loadNumber[identifier].tagList)break;
                    }
                    obj=JSON.parse(JSON.stringify(obj))
                    this.dataShowPermissionObj[list]=JSON.parse(JSON.stringify(this.dataShowPermissionObj[list]))
                    temporary.tagList= Object.assign(this.dataShowPermissionObj[list], obj)
                    if(identifier=='1'){
                        this.dataShowPermissionObj.tagList = temporary.tagList
                    }else{
                        this.taskAssignmentPermissions.tagList = temporary.tagList
                    }
                }
                this.initialHeigth()
            }
        },
        //tab切换
        handleClick(tab, event) {
            if(tab.label=="数据显示权限"){
                this.showTab=true;
            }else{
                this.showTab=false;
            }
            this.initialHeigth()
        },
        // 权限数据渲染
        handleJurisdictionInfo(params, isFn) {
            this.dataDisplayList()
                .then(({ data }) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //权限数据回调
        handleQueryInfoCallBack(data) {
            // 保存查询参数
            this.$store.commit("SAVE_JURISDICTION_MANAGEMENT", {
                key: "jurisdiction_management",
                value: JSON.stringify(this.queryData)
            });
            // 数据处理
            this.allJurisdiction = { ...data.data };
            //存储账号列表ID
            // this.allJurisdiction.accountList= {
            //     "AMAZON": [
            //         {
            //             "id": "1337",
            //             "account_name": "A-yixian加拿大"
            //         },
            //         {
            //             "id": "1338",
            //             "account_name": "A-yixian墨西哥"
            //         },
            //         {
            //             "id": "1336",
            //             "account_name": "A-yixian美国"
            //         },
            //         {
            //             "id": "1401",
            //             "account_name": "Acogedor加拿大"
            //         },
            //     ]
            // }
            for (const key in this.allJurisdiction.accountList) {
                // this.dataChecklist['1'].account_id[key]=[]
                // this.dataChecklist['2'].account_id[key]=[]
                this.dataChecklistId['1'].account_id[key]=[]
                this.dataChecklistId['2'].account_id[key]=[]
                this.storageId['1'].account_id[key]=[]
                this.storageId['2'].account_id[key]=[]
                let form = this.allJurisdiction.accountList[key]
                // for(let formKey in form){
                //     this.storageId['1'].account_id[key].push(formKey);
                //     this.storageId['2'].account_id[key].push(formKey);
                // }
                form.forEach(element => {
                    this.storageId['1'].account_id[key].push(element.id);
                    this.storageId['2'].account_id[key].push(element.id);
                });
            }
            // console.log(this.allJurisdiction.accountList['AMAZON'].length)
            //存储产品线分类列表和邮件分类列表id pro_line_id,tag_id: []
            for (const list in this.allJurisdiction) {
                let line='',sonItem='';
                if(list=='proLine'||list=='tagList'){
                    if(list=='proLine'){
                        line = 'pro_line_id';
                        sonItem = 'items';
                    }else{
                        line = 'tag_id';
                        sonItem = 'item';
                    }
                }else{
                    continue;
                }
                let oneLevelJurisdiction = this.allJurisdiction[list]
                for (const oneLevelkey in oneLevelJurisdiction) {
                    let towLevelJurisdiction = oneLevelJurisdiction[oneLevelkey][sonItem]
                    if(!towLevelJurisdiction){
                        this.storageId['1'][line].push(oneLevelkey)
                        this.storageId['2'][line].push(oneLevelkey)
                    }else{
                        for (const towLevelkey in towLevelJurisdiction) {
                            let threeLevelJurisdiction = towLevelJurisdiction[towLevelkey][sonItem]
                            if(!threeLevelJurisdiction){
                                this.storageId['1'][line].push(towLevelkey)
                                this.storageId['2'][line].push(towLevelkey)
                            }else{
                                for (const threeLevelkey in threeLevelJurisdiction) {
                                    let fourLevelJurisdiction = threeLevelJurisdiction[threeLevelkey][sonItem]
                                    if(!fourLevelJurisdiction){
                                        this.storageId['1'][line].push(threeLevelkey)
                                        this.storageId['2'][line].push(threeLevelkey)
                                    }else{
                                        for (const fourLevelkey in fourLevelJurisdiction) {
                                            this.storageId['1'][line].push(fourLevelkey)
                                            this.storageId['2'][line].push(fourLevelkey)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.handleInitial();
        },
        //先渲染一小部分
        handleInitial(){
            //先渲染一小部分数据
            for (const list in this.allJurisdiction) {
                let number=0;
                let obj = {};
                if (list=='accountList') {
                    let accountId = this.allJurisdiction[list];
                    for (const platform in accountId) {
                        this.dataShowPermissionObj.accountList[platform]={};
                        let account = accountId[platform];
                        for (const key in account) {
                            obj[key]=account[key]
                            if (number==100) break;
                            number++
                        }
                        if (number==100) {
                            this.dataShowPermissionObj.accountList[platform]=obj;
                            this.taskAssignmentPermissions.accountList[platform]=obj;
                            break;
                        }else{
                            this.dataShowPermissionObj.accountList[platform]=obj;
                            this.taskAssignmentPermissions.accountList[platform]=obj;
                            obj = {}
                        }
                    }
                }else if(list=='proLine'){
                    let proLineId = this.allJurisdiction[list]
                    for (const key in proLineId) {
                        obj[key] = proLineId[key]
                        if (number==2) break;
                        number++
                    }
                    this.dataShowPermissionObj.proLine=obj;
                    this.taskAssignmentPermissions.proLine=obj;
                }else if(list=='tagList'){
                    let tagId = this.allJurisdiction[list]
                    for (const key in tagId) {
                        obj[key] = tagId[key];
                        if (number==3) break;
                        number++
                    }
                    this.dataShowPermissionObj.tagList=obj;
                    this.taskAssignmentPermissions.tagList=obj;
                }
            }
        },
        //勾选权限
        handleCheckList(id, platform, str , identifier,maxId){
            for (const identifier in this.dataChecklistId) {
                let identifierJurisdiction = this.dataChecklistId[identifier];
                for (const list in identifierJurisdiction) {
                    if(list == 'account_id'){
                        let platform = identifierJurisdiction[list]
                        for (const key in platform) {
                            platform[key] = [...new Set(platform[key])]
                        }
                    }else{
                        identifierJurisdiction[list] = [...new Set(identifierJurisdiction[list])]
                    }
                }
            }
            if(platform){
                if(platform===id)this.dataChecklistId[identifier].account_id[platform] = [];
                console.log(id,str,identifier)
                if(document.getElementById(id+str+identifier).checked){
                    for(let memu in this.allJurisdiction.accountList){
                        let form = this.allJurisdiction.accountList[memu]
                        let memuBol = true;
                        form.forEach((element,index) => {
                            if(this.dataChecklistId[identifier].account_id[platform].indexOf(element.id)==-1) memuBol = false;
                            if(id==memu||id==element.id){
                                if(identifier=='2'){
                                    this.dataChecklistId['1'].account_id[platform].push(element.id)
                                }
                                this.dataChecklistId[identifier].account_id[platform].push(element.id)
                            }
                        });
                            // for(let formKey in form){
                            //     if(this.dataChecklistId[identifier].account_id[platform].indexOf(formKey)==-1) memuBol = false;
                            //     if(id==memu||id==formKey){
                            //         if(identifier=='2'){
                            //             this.dataChecklistId['1'].account_id[platform].push(formKey)
                            //         }
                            //         this.dataChecklistId[identifier].account_id[platform].push(formKey)
                            //     }
                            // }
                        if(memuBol){
                            if(document.getElementById(memu+str+identifier)){
                                document.getElementById(memu+str+identifier).checked=true;
                                if(identifier=='2'){
                                    document.getElementById(memu+str+"1").checked=true;
                                }
                            }
                        }else{
                            memuBol = true
                        }
                    }
                }else{
                    let memuBol = true;
                    for(let memu in this.allJurisdiction.accountList){
                        let form = this.allJurisdiction.accountList[memu]
                        form.forEach((element,index) => {
                            if(id==memu||id==element.id){
                                let indexId1 = this.dataChecklistId[identifier].account_id[platform].indexOf(element.id)
                                this.dataChecklistId[identifier].account_id[platform].splice(indexId1,1)
                                if(identifier=='2'){
                                    let indexId2 = this.dataChecklistId["1"].account_id[platform].indexOf(element.id)
                                    this.dataChecklistId["1"].account_id[platform].splice(indexId2,1)
                                }
                            }
                            if(this.dataChecklistId[identifier].account_id[platform].indexOf(element.id)==-1) memuBol = false;
                        });
                            // for(let formKey in form){
                            //     if(id==memu||id==formKey){
                            //         let indexId1 = this.dataChecklistId[identifier].account_id[platform].indexOf(formKey)
                            //         this.dataChecklistId[identifier].account_id[platform].splice(indexId1,1)
                            //         if(identifier=='2'){
                            //             let indexId2 = this.dataChecklistId["1"].account_id[platform].indexOf(formKey)
                            //             this.dataChecklistId["1"].account_id[platform].splice(indexId2,1)
                            //         }
                            //     }
                            //     if(this.dataChecklistId[identifier].account_id[platform].indexOf(formKey)==-1) memuBol = false;
                            // }
                            if(!memuBol){
                                if(document.getElementById(memu+str+identifier)){
                                    document.getElementById(memu+str+identifier).checked=false;
                                    if(identifier=='2')document.getElementById(memu+str+"1").checked=false;
                                }
                            }else{
                                memuBol = true
                            }
                    }
                }
                this.dataChecklistId[identifier].account_id[platform] = [...new Set(this.dataChecklistId[identifier].account_id[platform])]
                if(identifier=='2')this.dataChecklistId['1'].account_id[platform] = [...new Set(this.dataChecklistId['1'].account_id[platform])]
            }else{
                this.selectionMethod = false;
                let line = '',lineId = '',lineItem = '';
                if(str=='product'){
                    line = 'proLine';
                    lineId = 'pro_line_id';
                    lineItem = 'items';
                }else{
                    line = 'tagList';
                    lineId = 'tag_id';
                    lineItem = 'item';
                }
                if(document.getElementById(id+str+identifier).checked){
                    let formBol = true;
                    let threeBol = true;
                    let memuBol = true;
                    for(let memu in this.allJurisdiction[line]){
                        let form = {}
                        if(maxId==memu){
                            form = this.allJurisdiction[line][memu][lineItem]
                        }else{
                            continue;
                        }
                        if(id==memu){
                            this.dataChecklistId[identifier][lineId].push(id);
                        }
                        if(form!=undefined){
                            for(let formKey in form){
                                let threeLevel = form[formKey][lineItem]
                                if(id==memu||id==formKey){
                                    this.dataChecklistId[identifier][lineId].push(formKey);
                                    if(identifier=='2'){
                                        this.dataChecklistId['1'][lineId].push(formKey);
                                    }
                                }
                                if(threeLevel!=undefined){
                                    for(let threeLevelKey in threeLevel){
                                        let fourLevel = threeLevel[threeLevelKey][lineItem]
                                        if(id==memu||id==formKey||id==threeLevelKey){
                                            this.dataChecklistId[identifier][lineId].push(threeLevelKey);
                                            if(identifier=='2'){
                                                this.dataChecklistId['1'][lineId].push(threeLevelKey);
                                            }
                                        }
                                        if(fourLevel!=undefined){
                                            for(let fourLevelKey in fourLevel){
                                                if(id==memu||id==formKey||id==threeLevelKey||id==fourLevelKey){
                                                    this.dataChecklistId[identifier][lineId].push(fourLevelKey);
                                                    if(identifier=='2'){
                                                        this.dataChecklistId["1"][lineId].push(fourLevelKey);
                                                    }
                                                }
                                                if(this.dataChecklistId[identifier][lineId].indexOf(fourLevelKey)==-1) threeBol = false;
                                            }
                                            if(threeBol){
                                                this.dataChecklistId[identifier][lineId].push(threeLevelKey);
                                                if(identifier=='2')this.dataChecklistId['1'][lineId].push(threeLevelKey);
                                            }else{
                                                threeBol = true
                                            }
                                        }
                                        if(this.dataChecklistId[identifier][lineId].indexOf(threeLevelKey)==-1) formBol = false;
                                    }
                                    if(formBol){
                                        this.dataChecklistId[identifier][lineId].push(formKey);
                                        if(identifier=='2')this.dataChecklistId['1'][lineId].push(formKey);
                                    }else{
                                        formBol = true
                                    }
                                }
                                if(this.dataChecklistId[identifier][lineId].indexOf(formKey)==-1) memuBol = false;

                            }
                            if(memuBol){
                                this.dataChecklistId[identifier][lineId].push(memu);
                                if(identifier=='2')this.dataChecklistId['1'][lineId].push(memu);
                            }else{
                                memuBol = true
                            }
                        }
                        break;
                    }
                }else{
                    let formBol = true
                    let threeBol = true
                    let memuBol = true;
                    for(let memu in this.allJurisdiction[line]){
                        let form = {};
                        if(maxId==memu){
                            form = this.allJurisdiction[line][memu][lineItem]
                        }else{
                            continue;
                        }
                        if(id==memu){
                            let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(id)
                            this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                            if(identifier=='2'){
                                let indexId2 = this.dataChecklistId["1"][lineId].indexOf(id)
                                this.dataChecklistId["1"][lineId].splice(indexId2,1)
                            }
                        }
                        if(form==undefined){
                            continue;
                        }else{
                            for(let formKey in form){
                                let threeLevel = form[formKey][lineItem]
                                if(id==memu||id==formKey){
                                    let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(formKey)
                                    this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                                    if(identifier=='2'){
                                        let indexId2 = this.dataChecklistId['1'][lineId].indexOf(formKey)
                                        this.dataChecklistId['1'][lineId].splice(indexId2,1)
                                    }
                                }
                                if(this.dataChecklistId[identifier][lineId].indexOf(formKey)==-1) memuBol = false;
                                if(threeLevel==undefined){
                                    continue;
                                }else{
                                    for(let threeLevelKey in threeLevel){
                                        let fourLevel = threeLevel[threeLevelKey][lineItem]
                                        if(id==memu||id==formKey||id==threeLevelKey){
                                            let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(threeLevelKey)
                                            this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                                            if(identifier=='2'){
                                                let indexId2 = this.dataChecklistId['1'][lineId].indexOf(threeLevelKey)
                                                this.dataChecklistId['1'][lineId].splice(indexId2,1)
                                            }
                                        }
                                        if(this.dataChecklistId[identifier][lineId].indexOf(threeLevelKey)==-1) formBol = false;
                                        if(fourLevel==undefined){
                                            continue;
                                        }else{
                                            for(let fourLevelKey in fourLevel){
                                                if(id==memu||id==formKey||id==threeLevelKey||id==fourLevelKey){
                                                    let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(fourLevelKey)
                                                    this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                                                }
                                                    if(this.dataChecklistId[identifier][lineId].indexOf(fourLevelKey)==-1) threeBol = false;
                                            }
                                        }
                                        if(!threeBol){
                                            let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(threeLevelKey)
                                            if(indexId1>-1) this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                                            if(identifier=='2'){
                                                let indexId2 = this.dataChecklistId["1"][lineId].indexOf(threeLevelKey)
                                                if(indexId2>-1) this.dataChecklistId["1"][lineId].splice(indexId2,1)
                                            }
                                            threeBol = true
                                            formBol = false
                                            memuBol = false
                                        }
                                    }
                                }
                                if(!formBol){
                                    let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(formKey)
                                    if(indexId1>-1) this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                                    if(identifier=='2'){
                                        let indexId2 = this.dataChecklistId["1"][lineId].indexOf(formKey)
                                        if(indexId2>-1) this.dataChecklistId["1"][lineId].splice(indexId2,1)
                                    }
                                    formBol = true
                                    memuBol = false
                                }
                            }
                            if(!memuBol){
                                let indexId1 = this.dataChecklistId[identifier][lineId].indexOf(memu)
                                if(indexId1>-1) this.dataChecklistId[identifier][lineId].splice(indexId1,1)
                                if(identifier=='2'){
                                    let indexId2 = this.dataChecklistId["1"][lineId].indexOf(memu)
                                    if(indexId2>-1) this.dataChecklistId["1"][lineId].splice(indexId2,1)
                                }
                                memuBol = true
                            }
                        }
                        break;
                    }
                }
                this.dataChecklistId[identifier][lineId] = [...new Set(this.dataChecklistId[identifier][lineId])]
                if(identifier=='2')this.dataChecklistId['1'][lineId] = [...new Set(this.dataChecklistId['1'][lineId])]
            }
        },
        //获取用户权限
        handleQueryInfo(userId){
            let check = document.getElementsByTagName("input");
            for (let index = 0; index < check.length; index++) {
                check[index].checked = false;
            }
            this.dataChecklist['1'].pro_line_id = []
            this.dataChecklist['1'].tag_id = []
            this.dataChecklist['2'].pro_line_id = []
            this.dataChecklist['2'].tag_id = []
            this.dataChecklistId['1'].pro_line_id = []
            this.dataChecklistId['1'].tag_id = []
            this.dataChecklistId['2'].pro_line_id = []
            this.dataChecklistId['2'].tag_id = []
            for (const key in this.dataShowPermissionObj.accountList) {
                this.dataChecklist['1'].account_id[key]=[]
                this.dataChecklist['2'].account_id[key]=[]
                this.dataChecklistId['1'].account_id[key]=[]
                this.dataChecklistId['2'].account_id[key]=[]
            }
            if(userId)this.user_id=userId.select_user
            let obj={
                user_id:this.user_id
            }
            this.updateViewJurisdiction(obj).then(({ data }) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.action = data.data.action
                this.selectionMethod = true
                if(data.data["1"]||data.data["2"]){
                    this.dataJurisdiction = data.data
                    delete this.dataJurisdiction.action
                    for (const identifier in this.dataJurisdiction) {
                        let list = this.dataJurisdiction[identifier];
                        for (const key in list) {
                            let Jurisdiction = list[key]
                            if(key=='account_id'){
                                for (const platform in Jurisdiction) {
                                    let id = [...new Set(JSON.parse(Jurisdiction[platform]))];
                                    console.log(id.length)
                                    if(!this.storageId[identifier].account_id[platform])break;
                                    // id.forEach((element,index) => {
                                    //     if(this.storageId[identifier].account_id[platform].indexOf(element.id)==-1){
                                    //         id.splice(index,1);
                                    //     }
                                    // });
                                    try {
                                        this.dataChecklistId[identifier].account_id[platform] = id;
                                    } catch (error) {
                                        console.log('json解析111', error, id)
                                    }
                                }
                            }else if(key=='pro_line_id'&&Jurisdiction.length!=0){
                                try {
                                    this.dataChecklistId[identifier].pro_line_id = [...new Set(JSON.parse(Jurisdiction))]
                                } catch (error) {
                                    console.log('json解析', JSON.parse(Jurisdiction))
                                }
                            }else if(key=='tag_id'&&Jurisdiction.length!=0){
                                try {
                                    this.dataChecklistId[identifier].tag_id = [...new Set(JSON.parse(Jurisdiction))]
                                } catch (error) {
                                    console.log('json解析', JSON.parse(Jurisdiction))
                                }
                            }
                        }
                    }
                    this.dataChecklistId = {...this.dataChecklistId}
                }
            }).catch(err => {
                console.log(err);
            });
        },
        //管理用户权限(新增、编辑)
        handleManageUserJurisdiction(){
            let jurisdictionSubmission = {
                '1':{
                    account_id:{},
                    pro_line_id:[],
                    tag_id:[]
                },
                '2':{
                    account_id:{},
                    pro_line_id:[],
                    tag_id:[]
                }
            }
            for (const identifier in this.dataChecklistId) {
                let identifierJurisdiction = this.dataChecklistId[identifier];
                for (const list in identifierJurisdiction) {
                    if(list == 'account_id'){
                        let platform = identifierJurisdiction[list]
                        for (const key in platform) {
                            jurisdictionSubmission[identifier][list][key] = platform[key]
                        }
                    }else{
                        this.dataChecklistId[identifier][list].forEach(element => {
                            let index = this.storageId[identifier][list].indexOf(element);
                            if(index>-1)jurisdictionSubmission[identifier][list].push(element);
                        });
                    }
                }
            }
            let obj = {
                user_id:this.user_id,
                datas:JSON.stringify(jurisdictionSubmission)
            }
            if(this.action==1){
                this.newAddUserJurisdiction(obj).then(({ data }) => {
                    this.succeedCallBack(data)
                })
            }else{
                this.updateUserJurisdiction(obj).then(({ data }) => {
                    this.succeedCallBack(data)
                })
            }
        },
        //窗体高度
        initialHeigth() {
            this.$nextTick(()=> {
                let mainHeigth = document.getElementsByClassName("s-main")[0].scrollHeight; //获取当前窗口页面的高度
                let elMailHeigth = mainHeigth - 230;
                document.getElementsByClassName("el-tabs__content")[0].style.height =elMailHeigth + "px";
                let jurisdictionList = document.getElementsByClassName("jurisdictionList");
                let elMain = document.getElementsByClassName("el-main");
                for (let i = 0; i < jurisdictionList.length; i++) {
                    jurisdictionList[i].style.height = elMailHeigth - 15 + "px";
                    elMain[i].style.height = elMailHeigth - 41 + "px";
                    let dottedLine = elMain[i].getElementsByClassName("dottedLine");
                    let jurisdictionHeadStyle = elMain[i].getElementsByClassName("jurisdictionHeadStyle");
                    for(let d=0;d<dottedLine.length;d++){
                        let jurisdictionStyle = dottedLine[d].getElementsByClassName("jurisdictionStyle");
                        for(let j=0;j<jurisdictionStyle.length;j++){
                            if(j == jurisdictionStyle.length-1){
                                jurisdictionStyle[j].setAttribute("style","padding-bottom:10px;")
                                if(d==jurisdictionHeadStyle.length-1){
                                    jurisdictionStyle[j].setAttribute("style","padding-bottom:0;height:18px;")
                                }
                            }
                        }
                    }
                }
            })
        },
        //操作成功回调
        succeedCallBack(data) {
            if (data.status) {
                this.action=2
                this.$message.success("操作成功！");
            } else {
                this.$message.error(data.errorMess || "操作失败！");
            }
        },
        //收缩按钮
        handleClickRetractable(index,key,str,identifier,event){
            let buttonId = document.getElementById(key+index+str+identifier);
            let jurisdictionId = document.getElementById(key+str+identifier);
            if(buttonId.getAttribute("class")=="el-icon-minus"){
                buttonId.setAttribute("class","el-icon-plus");
                jurisdictionId.setAttribute("style","display:none;");
                this.handleScroll(identifier, str, '',event,key)
            }else{
                buttonId.setAttribute("class","el-icon-minus");
                jurisdictionId.setAttribute("style","display:block;");
                this.handleScroll(identifier, str, '',event,key)
            }
        },
    },
    computed: {
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    created() {
        this.thisVm = this;
        this.handleJurisdictionInfo();
        // try {
        //     if (JSON.stringify(this.queryParamsInfo) === "{}") {
        //         // this.handleJurisdictionInfo();
        //     } else {
        //         // 获取保存的查询参数
        //         this.queryData = JSON.parse(
        //             this.queryParamsInfo["jurisdiction_management"]
        //         );
        //         this.handleQueryInfoCallBack(data);
        //     }
        // } catch (e) {}
    },
    mounted() {
        this.initialHeigth();

    }
};
</script>

<style lang="less" scoped>
.jurisdictionMainInfo {
    display: flex;
    margin-top: 20px;
    /deep/.el-tabs.el-tabs--top.el-tabs--border-card {
        width: 100%;
    }
    /deep/.el-tabs__item.is-top {
        font-family: "Microsoft YaHei","微软雅黑";
        font-weight: 700;
        font-style: normal;
        font-size: 12px;
    }
    /deep/#pane-dataDisplay {
        display: flex;
        overflow-x: auto;
    }
    /deep/.jurisdictionList {
        border: 1px solid #e6e6e6;
        width: 350px !important;
        margin-left: 15px;
        .el-header {
            width: 350px;
            height: 26px !important;
            background-color: #fafafa;
            border-bottom: 1px solid #e6e6e6;
            text-align: center;
            font-family: "Microsoft YaHei","微软雅黑";
            font-weight: 700;
            font-style: normal;
            font-size: 12px;
            line-height: 26px;
        }
    }
    /deep/.jurisdictionList:nth-last-child(1) {
        margin-right: 15px;
    }
    /deep/.el-tabs__content {
        padding: 15px 0 0 0!important;
        .el-main {
            width: 350px;
            padding: 10px 20px 10px 0;
            .scroll{
                width: 100%;
                height: 100%;
                padding: 0 10px;
                overflow: auto;
                font-family: "Microsoft YaHei","微软雅黑";
                font-style: normal;
                font-size: 12px;
            }
        }
    }
}
/deep/.el-checkbox__label {
    display: none;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
  }
.el-tab-pane{
    display: flex;
}
.jurisdictionList{
    font-size: 12px;
    color: #525252;
    .jurisdictionStyle{
        display: flex;
    }
    input{
        border:1px solid #E3E6EC;
        background-color: white;
    }
    .oneLevelIcon{
        width: 12px;
        height: 12px;
        border: 1px solid #DCDFE4;
        color:#DCDFE4;
        font-weight: 900;
        text-align: center;
        line-height: 12px;
        display: inline-block;
        cursor: pointer;
    }
    .jurisdictionMax{
        position: relative;
        top: 15px;
        .jurisdictionHeadStyle{
            display: flex;
            position: relative;
            top: -15px;
        }
        .dottedLine{
            border-left: 1px dashed #DDE0E7;
            position: relative;
            top: -15px;
            left: 6px;
            .twoLevelDottedLine{
                color:#DDE0E7;
                padding: 10px 0 0 0;
                user-select: none;
            }
            .twoLevelJurisdiction{
                padding: 10px 8px 0 0;
            }
            .twoLevelCheckbox{
                margin: 0;
                display: inline;
                // vertical-align: top;
                line-height: 16px;
            }
        }
    }
}
.el-button.el-button--primary.el-button--small.is-round{
    background-color:#5196fe;
    border-color:#5196fe;
}
.el-tabs--border-card{
    box-shadow: none;
}
    input[type="checkbox"]{
        width:12px;
        height:12px;
        display: inline-block;
        text-align: center;
        // vertical-align: middle;
        line-height: 13px;
        position: relative;
    }
    input[type="checkbox"]::before{
        content: "";
        position: absolute;
        top: 0;left: 0;
        background: #fff;
        width: 100%;
        height: 100%;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
    }
    input[type="checkbox"]:checked::before{
        content: "\2713";
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        width:100%;
        border: 1px solid #409EFF;
        background-color: #409EFF;
        color:#fff;
        font-size: 12px;
        font-weight: bold;
    }
    label{
        user-select: none;
    }
</style>