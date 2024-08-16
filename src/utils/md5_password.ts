import crypto from 'crypto'

const md5Password = (password: string) => {
  const md5 = crypto.createHash('md5')
  //update转换为hash字符串，digest转化为16进制
  const res = md5.update(password).digest('hex')
  return res
}

export default md5Password
