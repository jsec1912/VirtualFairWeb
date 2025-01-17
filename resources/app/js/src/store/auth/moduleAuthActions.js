import axios from '../../http/axios/index.js'

export default {

  login ({ commit }, payload) {
    
    return new Promise((resolve, reject) => {
      
      axios.post('/api/auth/login', JSON.parse(JSON.stringify(payload)))
        .then(response => {
          if (response.data.user) {
            localStorage.setItem('accessToken', response.data.access_token)
            commit('UPDATE_USER_INFO', response.data.user)
            commit('SET_BEARER', response.data.access_token)
            resolve()
          } else {
            console.log(response.data)
            if (response.data.status === 'unmatched_fair') reject({message: 'unregistered_current_fair'})
            else reject({message: 'wrong_credentials'})
          }
        })
        .catch(() => {
          reject({message: 'wrong_credentials'})
        })
    })
  },
  register ({commit}, payload) {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(JSON.stringify(payload))
      const headers = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const formData = new FormData()
      for (const key in user) {
        if (key === 'category_interest') {
          if (user[key].length > 0) {
            for (let i = 0; i < user[key].length; i++) {
              formData.append(`${key}[${i}]`, user[key][i])
            }
          }
        } else {
          formData.append(key, user[key])
        }        
      }
      if (payload.avatar_file) formData.append('avatar_file', payload.avatar_file)
      axios.post('/api/auth/register', formData, headers)
        .then(response => {
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  logout ({commit}) {
    return new Promise((resolve, reject) => {
      
      axios.post('/api/auth/logout')
        .then(() => {
          commit('REMOVE_BEARER')
          localStorage.removeItem('userInfo')
          resolve()
        })
        .catch(error => { reject(error) })
      
    })
  },
  logged ({commit}) {
    commit('SET_BEARER')
  },
  fetchAccessToken () {
    return new Promise((resolve) => {
      return axios.post('/api/auth/refresh-token', {accessToken: localStorage.getItem('accessToKen')})
        .then(response => { resolve(response) })
    })
  }
}
