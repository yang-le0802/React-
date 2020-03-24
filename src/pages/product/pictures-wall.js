/* 
用于图片上传的组件
*/
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api/index'
import {BASE_IMGURL} from '../../utils/constants'

export default class PicturesWall extends Component {

  static propTypes = {
      imgs:PropTypes.array
  }

  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs && imgs.length>0){
        fileList= imgs.map((img,index)=>({
            uid:-index,
            name:img,
            status:'done',
            url:BASE_IMGURL+img
        }))
    }

  this.state = {
    previewVisible: false,//表示是否显示大图预览
    previewImage: '',//大图的url
    fileList
  }

  }

  getImgs = ()=>{
      return this.state.fileList.map(file=>file.name)
  }
  
  /* 隐藏modal */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
      //显示指定图片文件的大图
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  /* 
  file:当前操作的图片文件
  fileList：所有已上传的图片文件
  */
  handleChange = async ({ file,fileList }) => {
    //一旦上传成功，将当前上传的图片文件的file进行信息修正(name  url)
    if(file.status==='done'){
        const result = file.response
        if(result.status===0){
            message.success('上传成功')
            const {name,url} = result.data
            fileList[fileList.length-1].name = name
            fileList[fileList.length-1].url = url
        }
        else{
            message.error('上传失败')
        }
    }else if(file.status==='removed'){
        const result = await reqDeleteImg(file.name)
        if(result.status===0){
            message.success('删除成功')
        }else{
            message.error('删除失败')
        }
    }

    //在操作过程中更新fileList状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="manage/img/upload"//上传图片的基本路径
          accept='image/*'//只接受图片格式
          name='image'//请求参数名
          listType="picture-card"
          fileList={fileList}//所有已上传图片对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

