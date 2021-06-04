<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="rowStyle">
        <el-col>
          <span class="spanStyle">选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectCate"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editShowDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteparams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editShowDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteparams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 属性对话框 -->
    <el-dialog
      :title="'添加'+dialogText"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="cleraAttr"
    >
      <el-form :model="addRuleForm" :rules="addAttrRules" ref="addRuleRef" label-width="100px">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框 -->
    <el-dialog
      :title="'修改'+dialogText"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="cleraEditAttr"
    >
      <el-form :model="editRuleForm" :rules="editAttrRules" ref="editRuleRef" label-width="100px">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectCate: [],
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      addCateDialogVisible: false,
      addRuleForm: {},
      addAttrRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      editCateDialogVisible: false,
      editAttrRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      editRuleForm: {
        attr_name: ''
      }
    }
  },
  created() {
    this.getcateList()
  },
  methods: {
    async getcateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
      console.log(this.cateList)
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数
    async getParamsData() {
      console.log(this.selectCate)
      if (this.selectCate.length !== 3) {
        this.selectCate = []
        this.manyTableData = []
        this.onlyTableData = []
        return true
      }
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showDialog() {
      this.addCateDialogVisible = true
    },
    cleraAttr() {
      this.$refs.addRuleRef.resetFields()
    },
    addParams() {
      this.$refs.addRuleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.addCateDialogVisible = false
      })
    },
    async editShowDialog(rowData) {
      this.editCateDialogVisible = true
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${rowData.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editRuleForm = res.data
    },
    cleraEditAttr() {
      this.$refs.editRuleRef.resetFields()
    },
    editParams() {
      this.$refs.editRuleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editRuleForm.attr_id}`,
          {
            attr_name: this.editRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editCateDialogVisible = false
      })
    },
    async deleteparams(rowData) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('取消删除!')
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${rowData.attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getParamsData()
      this.$message.success(res.meta.msg)
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.updateAttrParams(row)
      row.inputVisible = !row.inputVisible
    },
    showInput(row) {
      row.inputValue = ''
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.updateAttrParams(row)
    },
    async updateAttrParams(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    // 如果获取的不是三级分类,按钮禁用
    isBtnDisabled() {
      if (this.selectCate.length !== 3) return true
      return false
    },
    getCateId() {
      if (this.selectCate.length === 3) return this.selectCate[2]
      return null
    },
    dialogText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rowStyle {
  margin: 15px;
}
.spanStyle {
  margin-right: 10px;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 130px;
}
</style>
