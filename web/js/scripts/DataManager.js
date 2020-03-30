var axios = require('axios')

const dataModel = JSON.parse(document.getElementById("content").dataset.model)
const urlPrefix = ''

const apiMap = {
    'clients': 'client-list',
    'config-defaults': 'admin/config-defaults',
    'meetings': 'meetings',
    'client-edit': 'client/',
    'client-conversions': 'conversions/',
    'client-config': 'configs/',
    'all-client-configs': 'client-configs',
    'config-edit': 'config/edit/',
    'conversion-edit': 'conversion/edit/',
    'tasks': 'tasks',
    'change_log': 'admin/change-log',
}

const getData = (view, id) => {
    view = apiMap[view] || view
    var url = urlPrefix + '/api/' + view
    if (id) {
        url = url + id
    }

    return axios
        .get(url)
        .then(function(response) {
            return response
        })
        .catch(function(error) {
            console.log('error::', error)
        })
}

const saveForm = (view, data) => {
    var url = urlPrefix + '/api/save/' + view
    return axios
        .post(url, data)
        .then(function(response) {
            return response
        })
        .catch(function(error) {
            console.log('error::', error)
        })
}

const deleteRecord = (view, id) => {
    var url = urlPrefix + '/api/delete/' + view + '/' + id

    return axios
        .get(url)
        .then(function(response) {
            return response
        })
        .catch(function(error) {
            console.log('error::', error)
        })
}

module.exports = {
    getData,
    saveForm,
    deleteRecord,
    urlPrefix
}