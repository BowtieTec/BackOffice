import {DiscountOnWhat, leftMenu, permission, settings, TypeOfCondition} from './sharedVariables'

const Ip = 'dev.bowtietech.pro'
const Port = '3000'
export const environment = {
  production: false,
  path: `https://${Ip}/public/`,
  serverAPI: `https://${Ip}:${Port}/v1/`,
  secretKey: '3%UC!C$WR7m$v^as@Sq8$4!^Mb25WS4i',
  DiscountOnWhat,
  TypeOfCondition,
  leftMenu: leftMenu,
  ...permission,
  settings
}
