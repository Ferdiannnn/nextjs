'use client';

interface ViewUserButtonProps {
    userId: number;
}

const ViewUserButton: React.FC<ViewUserButtonProps> = ({ userId }: ViewUserButtonProps) => {
    
    const handleClick = () => {
        alert('User ID: ' + userId);
    }
    
    return (

    <>
        <button onClick={handleClick} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-5 ">View User</button>
    </>
    
    );
}

export default ViewUserButton;