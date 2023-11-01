
    // 学科を更新
    function updateMateria(subject_id) {
      // 学科IDを取得してフォームに設定
      const updateForm = document.getElementById('update-materia-form');
      updateForm.reset();
      document.getElementById('update_subject_id').value = subject_id;

      // 学科情報を取得してフォームに設定
      const materia = materias.find(m => m.subject_id === subject_id);
      if (materia) {
        document.getElementById('update_subject_name').value = materia.subject_name;
        document.getElementById('update_professor_id').value = materia.professor_id;
        document.getElementById('update_credit_hours').value = materia.credit_hours;
      }
    }

    // 学科を実際に更新
    document.getElementById('update-materia-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const subject_id = document.getElementById('update_subject_id').value;
      const subject_name = document.getElementById('update_subject_name').value;
      const professor_id = document.getElementById('update_professor_id').value;
      const credit_hours = document.getElementById('update_credit_hours').value;

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
          getMaterias();
          document.getElementById('update-materia-form').reset();
        });
    });
