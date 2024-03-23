const burger = document.querySelector('.burger')
const nav = document.querySelector('.nav-links')
const navLinks = document.querySelectorAll('.nav-links li')
const alunoLink = document.querySelector('.nav-links li a[class="miniNavAluno"]')
const cadastroLink = document.querySelector('.nav-links li a[class="miniNavCadastro"]')
const navLinksAluno = document.querySelector('.nav-linksAluno')
const navLinksCadastro = document.querySelector('.nav-linksCadastro')

burger.addEventListener('click', () => {
  toggleNav()
})

alunoLink.addEventListener('click', event => {
  event.preventDefault()
  toggleNavAluno()
})

cadastroLink.addEventListener('click', event => {
  event.preventDefault()
  toggleNavCadastro()
})

function toggleNav() {
  nav.classList.toggle('nav-active')

  navLinks.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = ''
    } else {
      link.style.animation = `navLinksFade 0.5s ease forwards ${index / 20 + 0.8}s`
    }
  })

  burger.classList.toggle('toggle')
}

function toggleNavAluno() {
  navLinksAluno.style.display = navLinksAluno.style.display === 'none' ? 'block' : 'none'
}

function toggleNavCadastro() {
  navLinksCadastro.style.display = navLinksCadastro.style.display === 'none' ? 'block' : 'none'
}




// ここからサーバー関係 ##################################################
/* 
// ページ読み込み時に生徒リストを表示
window.onload = function () {
  getAlunos()
}

// 新しい生徒を追加する関数
function addAluno() {
  const nome = document.getElementById('nome').value
  const ra = document.getElementById('ra').value
  const endereco = document.getElementById('endereco').value
  const telefone = document.getElementById('telefone').value
  const email = document.getElementById('email').value
  const turma = document.getElementById('turma').value

  fetch('http://localhost:3000/alunos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome,
      ra,
      endereco,
      telefone,
      email,
      turma
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('addAlunoForm').reset()
      getAlunos()
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

// 生徒リストを取得して表示する関数
function getAlunos() {
  fetch('http://localhost:3000/alunos')
    .then(response => response.json())
    .then(data => {
      const alunoList = document.getElementById('alunoList')
      alunoList.innerHTML = ''

      data.forEach(aluno => {
        const row = alunoList.insertRow()
        row.innerHTML = `
                              <td>${aluno.id}</td>
                              <td>${aluno.nome}</td>
                              <td>${aluno.ra}</td>
                              <td>${aluno.endereco}</td>
                              <td>${aluno.telefone}</td>
                              <td>${aluno.email}</td>
                              <td>${aluno.turma}</td>
                              <td>
                                  <button onclick="updateAluno(${aluno.id}, '${aluno.nome}', '${aluno.ra}', '${aluno.endereco}', '${aluno.telefone}', '${aluno.email}', '${aluno.turma}')">更新</button>
                                  <button onclick="deleteAluno(${aluno.id})">削除</button>
                              </td>
                          `
      })
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

// 生徒を更新するフォームを表示する関数
function updateAluno(id, nome, ra, endereco, telefone, email, turma) {
  document.getElementById('updateAlunoId').value = id
  document.getElementById('updateNome').value = nome
  document.getElementById('updateRa').value = ra
  document.getElementById('updateEndereco').value = endereco
  document.getElementById('updateTelefone').value = telefone
  document.getElementById('updateEmail').value = email
  document.getElementById('updateTurma').value = turma

  document.getElementById('updateAlunoForm').style.display = 'block'
}

// 生徒の更新をサーバーに送信する関数
function submitUpdate() {
  const id = document.getElementById('updateAlunoId').value
  const nome = document.getElementById('updateNome').value
  const ra = document.getElementById('updateRa').value
  const endereco = document.getElementById('updateEndereco').value
  const telefone = document.getElementById('updateTelefone').value
  const email = document.getElementById('updateEmail').value
  const turma = document.getElementById('updateTurma').value

  fetch(`http://localhost:3000/alunos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome,
      ra,
      endereco,
      telefone,
      email,
      turma
    })
  })
    .then(response => response.json())
    .then(data => {
      getAlunos()
      alert('生徒が更新されました。')
      cancelUpdate()
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

// 生徒更新をキャンセルする関数
function cancelUpdate() {
  document.getElementById('updateAlunoForm').style.display = 'none'
}

// 生徒を削除する関数
function deleteAluno(id) {
  fetch(`http://localhost:3000/alunos/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      getAlunos()
      alert('生徒が削除されました。')
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
 */