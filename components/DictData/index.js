import Vue from 'vue'
import DataDict from '@/utils/dict'
import { getDicts as getDicts } from '@/api/dict/data'

function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          return getDicts(dictMeta.type).then(res => res)
        },
      },
    },
  })
}

export default {
  install,
}
