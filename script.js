const builder = document.getElementById('form-builder');
let fields = [];

function addField() {
  const field = {
    type: 'text',
    label: '',
    required: false,
    options: []
  };
  fields.push(field);
  renderBuilder();
}

function renderBuilder() {
  builder.innerHTML = '';
  fields.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'field';

    div.innerHTML = `
      <div class="form-group">
        <label>Label: <input value="${f.label}" onchange="updateField(${i}, 'label', this.value)"></label>
      </div>
      <div class="form-group">
        <label>Type:
          <select onchange="updateField(${i}, 'type', this.value)">
            <option value="text" ${f.type === 'text' ? 'selected' : ''}>Text</option>
            <option value="number" ${f.type === 'number' ? 'selected' : ''}>Number</option>
            <option value="email" ${f.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="dropdown" ${f.type === 'dropdown' ? 'selected' : ''}>Dropdown</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label>Required: <input type="checkbox" ${f.required ? 'checked' : ''} onchange="updateField(${i}, 'required', this.checked)"></label>
      </div>
      ${f.type === 'dropdown' ? `
        <div class="form-group">
          <label>Options (comma separated):<br>
          <input value="${f.options.join(',')}" onchange="updateField(${i}, 'options', this.value.split(','))">
          </label>
        </div>` : ''}
    `;
    builder.appendChild(div);
  });
}

function updateField(index, key, value) {
  fields[index][key] = value;
  renderBuilder();
}

function generateForm() {
  const form = document.getElementById('dynamic-form');
  form.innerHTML = '';
  fields.forEach((f, i) => {
    const label = document.createElement('label');
    label.textContent = f.label + (f.required ? ' *' : '');
    const input = f.type === 'dropdown' ? document.createElement('select') : document.createElement('input');

    if (f.type !== 'dropdown') {
      input.type = f.type;
    } else {
      f.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.trim();
        option.textContent = opt.trim();
        input.appendChild(option);
      });
    }

    input.name = `field_${i}`;
    if (f.required) input.required = true;

    const div = document.createElement('div');
    div.className = 'form-group';
    div.appendChild(label);
    div.appendChild(document.createElement('br'));
    div.appendChild(input);
    form.appendChild(div);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Submit';
  form.appendChild(submit);

  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((val, key) => obj[key] = val);
    document.getElementById('submitted-data').innerHTML =
      `<h3>Submitted Data (JSON)</h3><pre>${JSON.stringify(obj, null, 2)}</pre>`;
  };
}
