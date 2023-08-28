const users = [
    {
        id: '1',
        name: 'Andrew',
        email: 'andrew@example.com',
        age: 27
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'sarah@example.com',
        age: 26
    },
    {
        id: '3',
        name: 'Mike',
        email: 'mike@example.com',
        age: 28
    },
    {
        id: '4',
        name: 'Sergio',
        email: 'sergio@example.com',
        age: 35
    }
];

const posts = [
    {
        id: '1',
        title: 'GraphQL 101',
        body: 'This is how to use GraphQL...',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'GraphQL 201',
        body: 'This is an advanced GraphQL post...',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: 'Trading Music',
        body: 'Relax and focus',
        published: true,
        author: '2'
    },
    {
        id: '4',
        title: 'Programming Music',
        body: 'Boost your energy',
        published: true,
        author: '3'
    },
    {
        id: '5',
        title: 'Music for Studying',
        body: 'Concentrate and study',
        published: true,
        author: '4'
    }
];

const comments = [
    {
        id: '1',
        text: 'This worked well for me. Thanks!',
        author: '3',
        post: '1'
    },
    {
        id: '2',
        text: 'Glad you enjoyed it.',
        author: '1',
        post: '1'
    },
    {
        id: '3',
        text: 'This did not work.',
        author: '2',
        post: '2'
    },
    {
        id: '4',
        text: 'Nevermind. I got it to work.',
        author: '1',
        post: '3'
    },
    {
        id: '5',
        text: 'Amazing music for studying!',
        author: '4',
        post: '5'
    }
];

const db = {
    users,
    posts,
    comments
};

export { db as default };