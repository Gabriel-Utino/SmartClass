const apiUrl = 'http://localhost:3000/disciplinas'


// リストを表示
function displayDisciplina(disciplina) {
  const disciplinaList = document.getElementById('disciplinaList')
  disciplinaList.innerHTML = ''
  disciplina.forEach(disciplina => {
    const disciplinaElement = document.createElement('tr')
    disciplinaElement.innerHTML = `
              <td>${disciplina.id_disciplina}</td>
              <td>${disciplina.disciplina}</td>
              <td>${disciplina.nome}</td>
              <td>
                <button onclick="updateDisciplina(${disciplina.id_disciplina})">Editar</button>
                <button onclick="deleteDisciplina(${disciplina.id_disciplina})">Excluir</button>
              </td>
          `
          disciplinaList.appendChild(disciplinaElement)
  })
}
// select de yaru ataraku yaruhituyougaaru 

// 取得
function getDisciplina() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayDisciplina(data))
    .catch(error => console.error('Erro:', error))
}


// 追加
document.getElementById('addDisciplinaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const disciplinaName = document.getElementById('disciplinaName').value
  const disciplinaProf = document.getElementById('disciplinaProf').value
  const disciplinaProfNome = document.getElementById('disciplinaProfNome').value

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      disciplina: disciplinaName,
      id_prof: disciplinaProf,
      nome: disciplinaProfNome
    })
  })
    .then(response => response.json())
    .then(data => {
      getDisciplina()
      document.getElementById('addDisciplinaForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 更新
function updateProfessor(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editProfessorId').value = data.id_prof
      document.getElementById('editProfessorName').value = data.nome
      document.getElementById('editProfessorEmail').value = data.email_prof
      document.getElementById('editProfessorCPF').value = data.CPF
      document.getElementById('editProfessorSubject').value = data.materia_leci
      document.getElementById('editProfessorPhone').value = data.telefone
      // 文字列から Date オブジェクトを生成
      const birthDate = new Date(data.data_de_nascimento)
      // 年月日部分を取得
      const formattedBirthDate = `${birthDate.getFullYear()}-${(birthDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${birthDate.getDate().toString().padStart(2, '0')}`
      // フォーマットされた日付を設定
      document.getElementById('editProfessorBirthdate').value = formattedBirthDate
      document.getElementById('editProfessorPersonalEmail').value = data.email_pass
      document.getElementById('editProfessorAddress').value = data.endereco_prof
      document.getElementById('editProfessorForm').style.display = 'block'
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateDisciplinaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const professorId = document.getElementById('editProfessorId').value
  const professorName = document.getElementById('editProfessorName').value
  const professorEmail = document.getElementById('editProfessorEmail').value
  const professorCPF = document.getElementById('editProfessorCPF').value
  const professorSubject = document.getElementById('editProfessorSubject').value
  const professorPhone = document.getElementById('editProfessorPhone').value
  const professorBirthdate = document.getElementById('editProfessorBirthdate').value
  const professorPersonalEmail = document.getElementById('editProfessorPersonalEmail').value
  const professorAddress = document.getElementById('editProfessorAddress').value

  fetch(`${apiUrl}/${professorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: professorName,
      email_prof: professorEmail,
      CPF: professorCPF,
      materia_leci: professorSubject,
      telefone: professorPhone,
      data_de_nascimento: professorBirthdate,
      email_pass: professorPersonalEmail,
      endereco_prof: professorAddress
    })
  })
    .then(response => response.json())
    .then(data => {
      getDisciplina()
      document.getElementById('editProfessorForm').style.display = 'none'
    })
    .catch(error => console.error('Erro:', error))
})


// 削除ボタン
function deleteDisciplina(id_prof) {
  fetch(`${apiUrl}/${id_prof}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getDisciplina())
    .catch(error => console.error('Erro:', error))
}

getDisciplina()

function cancelEdit() {
  document.getElementById('updateDisciplinaForm').reset()
}

