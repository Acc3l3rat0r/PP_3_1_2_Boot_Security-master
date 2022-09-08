const header = document.getElementById('currentUserHeader')
const currentUserTable = document.getElementById('currentUserTable')

let result1 = ''
let result2 = ''
fetch('http://localhost:8080/api/currentUser')
    .then(res => res.json())
    .then(data => {
        result1 = `<tr>
                <td>${data.id}</td>
                <td>${data.firstName}</td>
                <td>${data.lastName}</td> 
                <td>${data.age}</td>
                <td>${data.email}</td>
                <td>${stringRoles(data.roles)}</td></tr>`
        result2 = `<h3 class="text bold">${data.email} with roles: ${stringRoles(data.roles)}</h3>`
        currentUserTable.innerHTML = result1
        header.innerHTML = result2
    })
function stringRoles(roles) {
    let result = []
    roles.forEach(role => {
        result.push(role.name)
    })
    return result.join(" ")
}