export const NoSubscription = {
    play_time: 0,
    chat_with_chessy: false,
    change_board_color: false,
    change_assistant_voice: false,
    change_predefined_questions: false,
    change_notation: false,
    change_sound_settings: false,
    view_captured_pieces: false,
}

export const BronzeSub = {
    play_time: 7200,
    chat_with_chessy: true,
    change_board_color: false,
    change_assistant_voice: false,
    change_predefined_questions: false,
    change_notation: true,
    change_sound_settings: true,
    view_captured_pieces: true,
}

export const SilverSub = {
    play_time: 18000,
    chat_with_chessy: true,
    change_board_color: true,
    change_assistant_voice: true,
    change_predefined_questions: false,
    change_notation: true,
    change_sound_settings: true,
    view_captured_pieces: true,
}

export const GoldSub = {
    play_time: 43200,
    chat_with_chessy: true,
    change_board_color: true,
    change_assistant_voice: true,
    change_predefined_questions: true,
    change_notation: true,
    change_sound_settings: true,
    view_captured_pieces: true,
}

export const PlatinumSub = {
    play_time: 'Unlimited',
    chat_with_chessy: true,
    change_board_color: true,
    change_assistant_voice: true,
    change_predefined_questions: true,
    change_notation: true,
    change_sound_settings: true,
    view_captured_pieces: true,
}

export const subPermissions = [
    {
        id: 0,
        Feature:'play_time',
        Bronze: 7200,
        Silver: 18000,
        Gold: 43200, 
        Platinum: 'Unlimited',
    },
    {
        id: 1,
        Feature:'chat_with_chessy',
        Bronze: true,
        Silver: true,
        Gold: true, 
        Platinum: true,
    },
    {
        id: 2,
        Feature:'change_board_color',
        Bronze: false,
        Silver: true,
        Gold: true, 
        Platinum: true,
    },
    {
        id: 3,
        Feature:'change_assistant_voice',
        Bronze: false,
        Silver: true,
        Gold: true, 
        Platinum: true,
    },
    {
        id: 4,
        Feature:'change_predefined_questions',
        Bronze: false,
        Silver: false,
        Gold: true, 
        Platinum: true,
    },
    {
        id: 5,
        Feature:'change_notation',
        Bronze: true,
        Silver: true,
        Gold: true, 
        Platinum: true,
    },
    {
        id: 6,
        Feature:'change_sound_settings',
        Bronze: true,
        Silver: true,
        Gold: true, 
        Platinum: true,
    },
    {
        id: 7,
        Feature:'view_captured_pieces',
        Bronze: true,
        Silver: true,
        Gold: true, 
        Platinum: true,
    },
]