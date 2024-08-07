import React, { useState } from 'react';

interface SubscriptionCodeInputProps {
    onCodeChange: (code: string) => void;
    code_error: string,
}

const SubscriptionCodeInput: React.FC<SubscriptionCodeInputProps> = ({ onCodeChange, code_error }) => {
    const [subCode, setSubCode] = useState('');

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubCode(event.target.value);
        onCodeChange(event.target.value);
    };

    return (
        <form className="space-y-6">
            <div>
                <label htmlFor="subscriptionCode" className="block text-sm font-medium text-gray-700">
                    Subscription code (enter 40000)
                </label>
                <input
                    type="text"
                    name="subscriptionCode"
                    id="subscriptionCode"
                    placeholder="Subscription code"
                    value={subCode}
                    onChange={handleCodeChange}
                    className={`mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${code_error ? 'border-red-600' : ''}`}
                />
                {
                    code_error && <label className="text-red-600 text-[14px]">{code_error}</label>
                }
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

export default SubscriptionCodeInput;