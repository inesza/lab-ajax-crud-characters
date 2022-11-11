const charactersAPI = new APIHandler('http://localhost:8000');
const api_url = "http://localhost:8000/"

window.addEventListener('load', async () => {
  const charContainer = document.querySelector('.characters-container')
  document.getElementById('fetch-all').addEventListener('click', async (event) => {
    event.preventDefault()
    try {
      await fetchAll()
    } catch (error) {
      console.error(error)
    }

  });

  document.getElementById('fetch-one').addEventListener('click', async (event) => {
    event.preventDefault()
    try {
      while (charContainer.lastChild) { charContainer.removeChild(charContainer.lastChild); }
      const id = document.querySelector('[name="character-id"]').value
      const { data } = await axios.get(api_url + 'characters/' + id)
      fillInfo(data)
    } catch (error) {
      console.error(error)
    }
  });

  document.getElementById('delete-one').addEventListener('click', async (event) => {
    event.preventDefault()
    const deleteBtn = document.getElementById('delete-one')
    try {
      const idToDelete = document.querySelector('[name="character-id-delete"]').value
      if (idToDelete) {
        await axios.delete(api_url + 'characters/' + idToDelete)
        deleteBtn.classList.remove('error')
        deleteBtn.classList.add('success')
      } else {
        deleteBtn.classList.add('error')
        deleteBtn.classList.remove('success')
      }
      await fetchAll()
    } catch (error) {
      deleteBtn.classList.add('error')
      deleteBtn.classList.remove('success')
      console.error(error)
    }
  });

  document.getElementById('edit-character-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = document.querySelector('#edit-character-form')
    const id = document.querySelector('[name="chr-id"]').value
    try {
      const { data } = await axios.get(api_url + 'characters/' + id)
      if (data) {
        const name = form.querySelector('[name="name"]').value
        const occupation = form.querySelector('[name="occupation').value
        const cartoon = form.querySelector('[name="cartoon"]').value
        const weapon = form.querySelector('[name="weapon"]').value
        const { charToUpdate } = await axios.patch(name, occupation, cartoon, weapon)
      }
      console.log(data)

    } catch (error) {
      console.error(error)
    }

  });

  document.getElementById('new-character-form').addEventListener('submit', async (event) => {
    console.log(1);
    event.preventDefault()
    console.log(2);

    try {
      const errorMsg = document.getElementById('error-msg')
      const newCharForm = document.getElementById('new-character-form')
      // getFormInputValues(newCharForm)
      const name = newCharForm.querySelector('[name="name"]').value
      const occupation = newCharForm.querySelector('[name="occupation').value
      let cartoon = newCharForm.querySelector('[name="cartoon"]').value
      cartoon === "on" ? cartoon = true : cartoon = false
      const weapon = newCharForm.querySelector('[name="weapon"]').value
      if (!name || !occupation || !weapon) {
        errorMsg.classList.add("show")
        setTimeout(() => {
          errorMsg.classList.remove("show")
        }, 1000);
      } else {
        const char = { name, occupation, weapon, cartoon }
        await axios.post(api_url + 'characters', char)
        await fetchAll()
      }

    } catch (error) {
      console.error(error)
    }

  });

  function fillInfo(char) {
    const charTemplate = document.querySelector('.char-template').content.cloneNode(true)
    const charInfo = charTemplate.querySelector('.character-info')
    charContainer.append(charInfo)
    charInfo.querySelector('.name').textContent += ": " + char.name
    charInfo.querySelector('.occupation').textContent += ": " + char.occupation
    charInfo.querySelector('.cartoon').textContent += ": " + char.cartoon
    charInfo.querySelector('.weapon').textContent += ": " + char.weapon
  }

  function getFormInputValues(form) {
    const name = form.querySelector('[name="name"]').value
    const occupation = form.querySelector('[name="occupation').value
    const cartoon = form.querySelector('[name="cartoon"]').value
    const weapon = form.querySelector('[name="weapon"]').value
    return { name, occupation, cartoon, weapon }
  }

  async function fetchAll() {
    try {
      charContainer.innerHTML = ''
      // while (charContainer.lastChild) { charContainer.removeChild(charContainer.lastChild); }
      const { data } = await axios.get(api_url + 'characters')
      data.forEach((el) => {
        fillInfo(el)
      })
    } catch (error) {
      console.error(error)
    }
  }
});
