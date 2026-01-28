
import CardList from '../components/Posts/CardList';
import ViewUserButton from '../components/Posts/ViewUserButton';
import styles from './postPage.module.css';

const base_url = "https://jsonplaceholder.typicode.com/posts"

interface Iposts {
    userId: number;
    id: number;
    title: string;
    body: string;
}

 const Posts = async() => {
    const response = await fetch(base_url, {
        cache: 'no-store'
    });
    const posts: Iposts[] = await response.json();
    return (
        <>
        <p>{new Date().toLocaleTimeString()}</p>

        <h1 className="text-fuchsia-500">Posts Page</h1>
        <CardList>
        {posts.map((post) => {
            return (          
            <div key={post.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{post.title}</div>
                <p className="text-gray-700 text-base">
                {post.body}
                </p>
                    <ViewUserButton userId={post.userId} />
            </div>
            </div>
            )
        
 })}
        </CardList>
        </>
        );
    };

    export default Posts;