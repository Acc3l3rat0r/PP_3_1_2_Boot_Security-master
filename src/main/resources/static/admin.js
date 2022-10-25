const url = 'http://localhost:8080/api/users'
const container = document.getElementById('allUsersTableBody')

const editModal = new bootstrap.Modal(document.getElementById('editModal'))
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))
const newUserForm = document.getElementById('newUserForm')
const deleteForm = document.getElementById('deleteForm')
const editForm = document.getElementById('editForm')
let roles = []

const display = (users) => {
    let result = ''
    users.forEach(user => {
        result +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td> 
                <td>${user.age}</td>
                <td>${user.email}</td>
                <input type="hidden" value="${user.password}">
                <td>${stringRoles(user.roles)}</td>
                <td><a class="btnEdit btn btn-info text-white">Edit</a></td>
                <td><a class="btnDelete btn btn-danger text-white">Delete</a></td>
            </tr>`
    })
    container.innerHTML = result
    // let newRoleSelect = document.getElementById('newRole')
    // $('#newRole').empty()
    // newRoleSelect.add(new Option('ROLE_ADMIN', 'ROLE_ADMIN'))
    // newRoleSelect.add(new Option('ROLE_USER', 'ROLE_USER'))
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

on(document, 'click', '.btnDelete', e => {
    const file = e.target.parentNode.parentNode
    document.getElementById('deleteId').value = file.children[0].innerHTML
    document.getElementById('deleteFirstName').value = file.children[1].innerHTML
    document.getElementById('deleteLastName').value = file.children[2].innerHTML
    document.getElementById('deleteAge').value = file.children[3].innerHTML
    document.getElementById('deleteEmail').value = file.children[4].innerHTML
    var roleSelect = document.getElementById('deleteRoles')
    $('#deleteRoles').empty()
    const roles = file.children[6].innerHTML.split(' ')
    roles.forEach(r => {
        roleSelect.add(new Option(r, r))
    })
    deleteModal.show()
})
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let token = $("meta[name='_csrf']").attr("content");
    let header = $("meta[name='_csrf_header']").attr("content");
    const id = document.getElementById('deleteId').value
    fetch(url + `/${id}`, {
        method: 'DELETE',
        headers: {
            [header]: token,
        }
    }).then(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => display(data))
            .catch(error => console.log(error))
    })
    deleteModal.hide()
})

on(document, 'click', '.btnEdit', e => {
    const file = e.target.parentNode.parentNode
    document.getElementById('editId').value = file.children[0].innerHTML
    document.getElementById('editFirstName').value = file.children[1].innerHTML
    document.getElementById('editLastName').value = file.children[2].innerHTML
    document.getElementById('editAge').value = file.children[3].innerHTML
    document.getElementById('editEmail').value = file.children[4].innerHTML
    document.getElementById('editPassword').value = file.children[5].value
    roles = []
    const role = file.children[6].innerHTML.split(' ')
    for (let i = 0; i < role.length; ++i) {
        addRole(role[i])
    }
    let roleSelect = document.getElementById('editRoles')
    $('#editRoles').empty()
    roleSelect.add(new Option('ROLE_USER', 'ROLE_USER'))
    roleSelect.add(new Option('ROLE_ADMIN', 'ROLE_ADMIN'))
    editModal.show()
})
editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const id = document.getElementById('editId').value
    const firstName = document.getElementById('editFirstName').value
    const lastName = document.getElementById('editLastName').value
    const age = document.getElementById('editAge').value
    const email = document.getElementById('editEmail').value
    const password = document.getElementById('editPassword').value

    $('#editRoles option').each(function () {
        roles.forEach(r => {
            if (this.selected) {
                if (!(this.value.includes(r.name))) {
                    addRole(this.value)
                    return false;
                } else {
                    roles = []
                    roles.push(r)
                    return false;
                }
            }
        })
    })
    postQuery(id, firstName, lastName, age, email, password, roles)
    editModal.hide()
    roles = []
})

newUserForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const firstName = document.getElementById('newFirstName').value
    const lastName = document.getElementById('newLastName').value
    const age = document.getElementById('newAge').value
    const email = document.getElementById('newEmail').value
    const password = document.getElementById('newPassword').value
    const role = document.getElementById('newRole')
    var values = [];
    if (role.multiple) {
        for (var i = 0; i < role.options.length; i++) {
            if (role.options[i].selected)
                values.push(role.options[i].value);
        }
    } else {
        values.push(role.value);
    }
    values.forEach(v => {
        addRole(v)
    })
    postQuery('', firstName, lastName, age, email, password, roles)
    roles = []
    let navTable = document.getElementById('userTable')
    let table = document.getElementById('tab1')
    let newUserTab = document.getElementById('newUserTab')
    let newUserForm = document.getElementById('tab2')
    newUserTab.className = 'nav-link'
    newUserForm.className = 'tab-pane'
    navTable.className = 'nav-link active'
    table.className = 'tab-pane active'
})

function postQuery(id, firstName, lastName, age, email, password, roles) {
    let token = $("meta[name='_csrf']").attr("content");
    let header = $("meta[name='_csrf_header']").attr("content");
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            [header]: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        })
    }).then(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => display(data))
            .catch(error => console.log(error))
    })
}

function addRole(value) {
    if (value.includes('ROLE_ADMIN')) {
        roles.push({
            id: '1',
            name: 'ROLE_ADMIN',
            users: null,
            authority: 'ROLE_ADMIN'
        })
    } else if (value.includes('ROLE_USER')) {
        roles.push({
            id: '2',
            name: 'ROLE_USER',
            users: null,
            authority: 'ROLE_USER'
        })
    }
}

function stringRoles(roles) {
    let result = []
    roles.forEach(role => {
        result.push(role.name)
    })
    return result.join(" ")
}


fetch(url)
    .then(response => response.json())
    .then(data => display(data))
    .catch(error => console.log(error))