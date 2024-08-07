import React, { useState } from 'react';

interface UsernameInputProps {
    onUsernamesChange: (usernames: { chessComUsername: string, lichessUsername: string }) => void,
    name_error: string,
}

const UsernameInput: React.FC<UsernameInputProps> = ({ onUsernamesChange, name_error }) => {
    const [chessComUsername, setChessComUsername] = useState('');
    const [lichessUsername, setLichessUsername] = useState('');

    const handleChessComChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChessComUsername(event.target.value);
        onUsernamesChange({ chessComUsername: event.target.value, lichessUsername });
    };

    const handleLichessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLichessUsername(event.target.value);
        onUsernamesChange({ chessComUsername, lichessUsername: event.target.value });
    };

    return (
        <form className="space-y-6">
            <div>
                <label htmlFor="chessComUsername" className="block text-sm font-medium text-gray-700">
                    Chess.com Username
                </label>
                <input
                    type="text"
                    name="chessComUsername"
                    id="chessComUsername"
                    placeholder="Chess.com username"
                    value={chessComUsername}
                    onChange={handleChessComChange}
                    className={`mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                     focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${name_error? 'border-red-600' : ''}`}
                />
                <label className="text-red-600 text-[14px]">{name_error}</label>
            </div>

            {/*<div>
                <label htmlFor="lichessUsername" className="block text-sm font-medium text-gray-700">
                    Lichess Username
                </label>
                <input
                    type="text"
                    name="lichessUsername"
                    id="lichessUsername"
                    placeholder="Lichess username"
                    value={lichessUsername}
                    onChange={handleLichessChange}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>*/}
        </form>
    );
};

export default UsernameInput;