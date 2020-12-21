import React, { useState, useEffect } from 'react';

import './styles.css';

import api from './services/api';

function App() {

  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
      api.get('repositories').then(response => {
          setRepositories(response.data);
      })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      id: `${Date.now()}`,
      title: `Novo Repositorio ${Date.now()}          `,
      url: 'https://github.com/diego3g',
      techs: ['NextJS', 'ExpressJS', 'AWS']
    });

    const repository = response.data;

    setRepositories( [...repositories, repository] );
  }

  async function handleRemoveRepository(id) {
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    const response = await api.delete(`repositories/${id}`);

    if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found' });
    }

    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
            <li key={repository.id}>
                {repository.title}
                <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
            </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
