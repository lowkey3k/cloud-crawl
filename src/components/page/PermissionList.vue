<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 权限列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="handleAdd"
                >添加资源
                </el-button>
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
                <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <el-input v-model="query.f_like_name" placeholder="资源名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_like_sign" placeholder="资源标识" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_like_url" placeholder="资源地址" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_eq_type" placeholder="资源类型" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_eq_status" placeholder="状态" class="handle-input mr10"></el-input>

                <el-button style="float: right" type="primary" icon="el-icon-search" @click="handleSearch">搜索
                </el-button>
            </div>
            <!--<el-table-->
            <!--:data="tableData"-->
            <!--style="width: 100%;margin-bottom: 20px;"-->
            <!--row-key="id"-->
            <!--border-->
            <!--default-expand-all-->
            <!--:tree-props="{children: 'children', hasChildren: 'hasChildren'}">-->
            <!--<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
            <!--<el-table-column prop="name" label="资源名称"></el-table-column>-->
            <!--<el-table-column prop="sign" label="资源标识"></el-table-column>-->
            <!--<el-table-column prop="description" label="资源描述"></el-table-column>-->
            <!--</el-table>-->

            <el-table
                    :data="tableData"
                    border
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    row-key="id"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="资源名称"></el-table-column>
                <el-table-column prop="sign" label="资源标识"></el-table-column>
                <el-table-column prop="description" label="资源描述"></el-table-column>

                <el-table-column prop="url" label="资源地址"></el-table-column>

                <el-table-column prop="type" label="资源类型" :formatter="typeFormat"></el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0"
                                @change="handleStatusChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>


                <!--<el-table-column prop="date" label="注册时间"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                        <image src="../../assets/logo.png"></image>
                    </template>
                </el-table-column>
            </el-table>


            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNo"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="35%">
            <el-form ref="editForm" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="name" label="资源名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="sign" label="资源标识">
                    <el-input v-model="form.sign"></el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-select placeholder="资源类型" @change="changeSelect" v-model="permissionCode">
                        <el-option v-for="item in permissionTypes" :key="item.code" :label="item.name"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="资源地址">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="资源描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="35%">
            <el-form ref="addForm" :model="form" :rules="addRules" label-width="80px">
                <el-form-item prop="name" label="资源名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="sign" label="资源标识">
                    <el-input v-model="form.sign"></el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-select placeholder="资源类型" @change="changeSelect" v-model="permissionCode">
                        <el-option v-for="item in permissionTypes" :key="item.code" :label="item.name"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源地址">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="资源描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPermission">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {edit, fetchData, deleteUser} from '../../api/user';
    import {findTreeByPid} from '../../api/datadict';

    import {
        getPermissionPage,
        getPermissionTree,
        addPermission,
        editCheckUnique,
        editPermission,
        deletePermission
    } from '../../api/permission';
    import service from '../../utils/request';


    export default {
        name: 'basetable',
        data() {
            let checkSign = (rule, value, callback) => {
                service.get('permission/checkUnique?name=sign&value=' + this.form.sign).then(function (result) {
                    if (result.result) {
                        return callback(new Error('资源已存在'));
                    } else {
                        callback();
                    }
                });
            };
            let editCheckSign = (rule, value, callback) => {
                let param = {
                    id: this.form.id,
                    name: 'sign',
                    value: this.form.sign
                };
                editCheckUnique(param).then(function (result) {
                    if (result.result) {
                        return callback(new Error('资源已存在'));
                    } else {
                        callback();
                    }
                });
            };
            return {
                query: {
                    // address: '',
                    name: '',
                    pageNo: 1,
                    pageSize: 10,
                    f_like_name: '',
                    f_like_username: '',
                    f_like_sign: '',
                    f_eq_status: '',
                    f_eq_type: '',
                    f_like_url: ''

                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                permissionCode: '',
                permissionTypes: [],
                rules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    name: [{required: true, message: '请输入资源名称', trigger: 'blur'}],
                    sign: [{required: true, message: '请输入资源标识', trigger: 'blur'},
                        {
                            validator: editCheckSign,
                            trigger: 'blur'
                        }]
                },
                addRules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    name: [{required: true, message: '请输入资源名称', trigger: 'blur'}],
                    sign: [{required: true, message: '请输入资源标识', trigger: 'blur'},
                        {
                            validator: checkSign,
                            trigger: 'blur'
                        }]
                }
            };
        },
        created() {
            this.getData();
            this.getPermissionType();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                getPermissionTree(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.result;
                    this.pageTotal = res.result.total || 0;
                });
            },
            statusFormat(row, column) {
                if (row.status === 1) {
                    return '有效';
                } else {
                    return '无效';
                }
            },
            typeFormat(row, column) {
                return this.permissionTypes.map(function (obj, index) {
                    if (obj.code === row.type) {
                        return obj.name;
                    }
                });
            },
            changeSelect(code) {
                this.permissionCode = code;
            }
            ,
            getPermissionType() {
                let param = {f_eq_pid: "1002"};
                let vm = this;
                findTreeByPid(param).then(function (res) {
                    if (res.code === '0') {
                        vm.permissionTypes = res.result;
                    }
                })
            },
            // 资源状态修改
            handleStatusChange(row) {
                let text = row.status === 1 ? '启用' : '停用';
                this.$confirm('确认要"' + text + '""' + row.name + '"资源吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    let data = {
                        id: row.id,
                        status: row.status
                    };
                    return editPermission(data);
                }).then(() => {
                    this.$message.success(text + '成功');
                }).catch(function () {

                    row.status = row.status === 0 ? 1 : 0;
                });

            },
            roleFormat(row, column) {
                return row.roles.map(function (obj, index) {
                    return obj.name;
                }).join(',');
            },
            // 触发搜索按钮
            handleSearch() {
                // this.$set(this.query,"pageNo",1);
                this.$set(this.query);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let vm = this;
                        let param = {'id': row.id};
                        deletePermission(param).then(function (result) {
                            if (result.code === '0') {
                                vm.$message.success('删除成功');
                                vm.tableData.splice(index, 1);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.getPermissionType();
                this.editVisible = true;
                let vm = this;
                this.permissionCode = row.type;
            },
            // 保存编辑
            saveEdit() {
                this.$refs.editForm.validate(validate => {
                    if (validate) {
                        this.$set(this.tableData, this.idx, this.form);
                        this.form.type = this.permissionCode;
                        let vm = this;
                        editPermission(this.form).then(function (result) {
                            if (result.code === '0') {
                                vm.$message.success(`修改成功`);
                                vm.editVisible = false;
                                vm.getData();
                            }
                        });
                    } else
                        return false;
                });

            }
            ,
            handleAdd() {
                this.getPermissionType();
                this.addVisible = true;
                //每次都初始化为空
                this.form = {};
            },
            // 保存
            addPermission() {
                this.$refs.addForm.validate(validate => {
                    if (validate) {
                        let vm = this;
                        addPermission(this.form).then(function (res) {
                            if (res.code === '0') {
                                vm.$message.success('添加成功');
                                vm.addVisible = false;
                                vm.getData();
                            }
                        });
                    } else
                        return false;
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
