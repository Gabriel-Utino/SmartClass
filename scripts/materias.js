// APIエンドポイントのURL
const apiUrl = 'http://localhost:3000/materias'

// 学科リストを表示
function displayMaterias(materias) {
  const materiaList = document.getElementById('materia-list')
  materiaList.innerHTML = ''
  materias.forEach(materia => {
    const row = document.createElement('tr')
    row.innerHTML = `
          <td>${materia.subject_id}</td>
          <td>${materia.subject_name}</td>
          <td>${materia.professor_id}</td>
          <td>${materia.credit_hours}</td>
          <td>
            <button onclick="updateMateria(${materia.subject_id})">Atualizar</button>
            <button onclick="deleteMateria(${materia.subject_id})">Excluir</button>
          </td>
        `
    materiaList.appendChild(row)
  })
}

// 学科を取得
function getMaterias() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayMaterias(data))
}

// 新しい学科を追加
document.getElementById('add-materia-form').addEventListener('submit', function (event) {
  event.preventDefault()
  const subject_name = document.getElementById('subject_name').value
  const professor_id = document.getElementById('professor_id').value
  const credit_hours = document.getElementById('credit_hours').value

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject_name,
      professor_id,
      credit_hours
    })
  })
    .then(response => response.json())
    .then(data => {
      getMaterias()
      document.getElementById('add-materia-form').reset()
    })
})

// 学科を更新
function updateMateria(subject_id) {
  // 学科IDを取得してフォームに設定
  const updateForm = document.getElementById('update-materia-form')
  updateForm.reset()
  document.getElementById('update_subject_id').value = subject_id

  // 学科情報を取得してフォームに設定
  const materia = materias.find(m => m.subject_id === subject_id)
  if (materia) {
    document.getElementById('update_subject_name').value = materia.subject_name
    document.getElementById('update_professor_id').value = materia.professor_id
    document.getElementById('update_credit_hours').value = materia.credit_hours
  }
}

// 学科を実際に更新
document.getElementById('update-materia-form').addEventListener('submit', function (event) {
  event.preventDefault()
  const subject_id = document.getElementById('update_subject_id').value
  const subject_name = document.getElementById('update_subject_name').value
  const professor_id = document.getElementById('update_professor_id').value
  const credit_hours = document.getElementById('update_credit_hours').value

  fetch(`${apiUrl}/${subject_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject_name,
      professor_id,
      credit_hours
    })
  })
    .then(response => response.json())
    .then(data => {
      getMaterias()
      document.getElementById('update-materia-form').reset()
    })
})

// 学科を削除
function deleteMateria(subject_id) {
  fetch(`${apiUrl}/${subject_id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getMaterias())
}

// 初期データの読み込み
getMaterias()
