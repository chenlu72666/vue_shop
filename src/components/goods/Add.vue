<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableCate" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableCate" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnStyle" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="预览图片" :visible.sync="dialogVisible" width="50%">
      <img :src="picAddr" alt style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
// 拷贝的方法
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      manyTableCate: [],
      onlyTableCate: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      picAddr: '',
      dialogVisible: false
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
      console.log(res.data)
    },
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = [])
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.trim() !== '' ? item.attr_vals.trim().split(' ') : []
        })
        this.manyTableCate = res.data
        console.log(this.manyTableCate)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTableCate = res.data
        console.log(this.onlyTableCate)
      }
    },
    handleRemove(file) {
      console.log(file)
      const picPath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === picPath)
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
    },
    // 图片预览
    handlePreview(file) {
      console.log(file)
      this.picAddr = file.response.data.url
      this.dialogVisible = true
    },
    // 图片上传成功
    handleSuccess(response) {
      console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项!')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableCate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableCate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnStyle {
  margin-top: 15px;
}
</style>
