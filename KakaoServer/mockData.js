const FRIENDLIST_MOCK_DATA = [
            { profileImg: "https://picsum.photos/seed/pic1/100", name: "홍길동전", profileMessage: "안녕하세요!" },
            { profileImg: "https://picsum.photos/seed/pic2/100", name: "임꺽정", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic3/100", name: "장길산", profileMessage: "즐거운 하루 보내세요." },
            { profileImg: "https://picsum.photos/seed/pic4/100", name: "이몽룡", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic5/100", name: "성춘향", profileMessage: "오늘도 파이팅!" },
            { profileImg: "https://picsum.photos/seed/pic6/100", name: "변학도", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic7/100", name: "심청이", profileMessage: "반가워요 😊" },
            { profileImg: "https://picsum.photos/seed/pic8/100", name: "심봉사", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic9/100", name: "춘향모", profileMessage: "맛있는 점심 드세요." },
            { profileImg: "https://picsum.photos/seed/pic10/100", name: "방자", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic11/100", name: "향단이", profileMessage: "좋은 하루!" },
            { profileImg: "https://picsum.photos/seed/pic12/100", name: "장화", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic13/100", name: "홍련", profileMessage: "화이팅합시다!" },
            { profileImg: "https://picsum.photos/seed/pic14/100", name: "김삿갓", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic15/100", name: "허균", profileMessage: "멋진 하루 되세요~" }
];

const MESSAGELIST_MOCK_DATA = [
            { messageImg: "https://picsum.photos/seed/msg1/100", name: "홍길동전", resentMessage: "안녕하세요!", resentMessageSentAt: "2025-06-10T07:45:00Z", notificationCount: 3 },
            { messageImg: "https://picsum.photos/seed/msg2/100", name: "임꺽정", resentMessage: "오늘 저녁에 시간 돼요?", resentMessageSentAt: "2025-06-09T14:15:00Z", notificationCount: 1 },
            { messageImg: "https://picsum.photos/seed/msg3/100", name: "장길산", resentMessage: "즐거운 하루 보내세요.", resentMessageSentAt: "2025-06-08T09:00:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg4/100", name: "이몽룡", resentMessage: "잘 지내고 있죠?", resentMessageSentAt: "2025-06-10T17:30:00Z", notificationCount: 5 },
            { messageImg: "https://picsum.photos/seed/msg5/100", name: "성춘향", resentMessage: "오늘도 파이팅!", resentMessageSentAt: "2025-06-10T13:20:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg6/100", name: "변학도", resentMessage: "회의자료 확인 부탁드립니다.", resentMessageSentAt: "2025-06-07T08:55:00Z", notificationCount: 2 },
            { messageImg: "https://picsum.photos/seed/msg7/100", name: "심청이", resentMessage: "반가워요 😊", resentMessageSentAt: "2025-06-10T10:15:00Z", notificationCount: 4 },
            { messageImg: "https://picsum.photos/seed/msg8/100", name: "심봉사", resentMessage: "감사합니다.", resentMessageSentAt: "2025-06-10T16:50:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg9/100", name: "춘향모", resentMessage: "맛있는 점심 드세요.", resentMessageSentAt: "2025-06-09T12:35:00Z", notificationCount: 6 },
            { messageImg: "https://picsum.photos/seed/msg10/100", name: "방자", resentMessage: "네, 확인했습니다.", resentMessageSentAt: "2025-06-10T15:10:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg11/100", name: "향단이", resentMessage: "좋은 하루!", resentMessageSentAt: "2025-06-10T11:25:00Z", notificationCount: 1 },
            { messageImg: "https://picsum.photos/seed/msg12/100", name: "장화", resentMessage: "사진 잘 받았어요.", resentMessageSentAt: "2025-06-08T18:45:00Z", notificationCount: 7 },
            { messageImg: "https://picsum.photos/seed/msg13/100", name: "홍련", resentMessage: "화이팅합시다!", resentMessageSentAt: "2025-06-10T06:05:00Z", notificationCount: 9 },
            { messageImg: "https://picsum.photos/seed/msg14/100", name: "김삿갓", resentMessage: "곧 연락드릴게요.", resentMessageSentAt: "2025-06-10T21:15:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg15/100", name: "허균", resentMessage: "멋진 하루 되세요~", resentMessageSentAt: "2025-06-10T07:30:00Z", notificationCount: 8 }
        ];

const  CHATTING_INFO_MOCK_DATA = [
                                {chattingImg: "https://randomuser.me/api/portraits/men/1.jpg", chattingName: "허균", chattingCount : "2"}
                                ]

const  CHATTING_MOCK_DATA = [
                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "안녕하세요, 허균님. 오늘 일정 괜찮으신가요?",
                        sentAt: "2025-06-10T09:30:00Z",
                        isAuthor: true
                    },
                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "안녕하세요, 홍길동님. 네, 오늘은 오전은 여유롭고 오후는 회의 하나 있습니다.",
                        sentAt: "2025-06-10T09:31:15Z",
                        isAuthor: false
                    },
                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "저도 비슷하네요. 오전 중에 자료 하나만 정리해서 보내드릴게요.",
                        sentAt: "2025-06-10T09:32:40Z",
                        isAuthor: true
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "참, 지난번에 요청하셨던 리포트도 같이 첨부하겠습니다.",
                        sentAt: "2025-06-10T09:32:55Z",
                        isAuthor: true
                    },
                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "혹시 추가로 필요하신 자료 있으면 말씀 주세요.",
                        sentAt: "2025-06-10T09:33:20Z",
                        isAuthor: true
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "네, 감사합니다. 그 정도면 충분할 것 같습니다.",
                        sentAt: "2025-06-10T09:34:10Z",
                        isAuthor: false
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "자료 정리 끝났습니다. 지금 메일로 보냈어요.",
                        sentAt: "2025-06-10T09:37:20Z",
                        isAuthor: true
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "확인해볼게요.",
                        sentAt: "2025-06-10T09:37:50Z",
                        isAuthor: false
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "자료 잘 받았습니다. 구성도 좋네요.",
                        sentAt: "2025-06-10T09:44:30Z",
                        isAuthor: false
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "감사합니다.",
                        sentAt: "2025-06-10T09:44:50Z",
                        isAuthor: false
                    },
                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "오늘 회의 때 발표 먼저 진행하실 예정이신가요?",
                        sentAt: "2025-06-10T09:45:15Z",
                        isAuthor: false
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "네, 제가 먼저 발표 진행하고 이후에 토론으로 넘어가면 좋을 것 같아요.",
                        sentAt: "2025-06-10T09:46:20Z",
                        isAuthor: true
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "잠깐 자리 비웠습니다. 돌아오면 다시 메시지 드릴게요.",
                        sentAt: "2025-06-10T10:01:10Z",
                        isAuthor: true
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "홍길동",
                        message: "돌아왔습니다! 혹시 방금 메일도 잘 수신되셨나요?",
                        sentAt: "2025-06-10T10:26:10Z",
                        isAuthor: true
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "네, 메일 잘 확인했습니다.",
                        sentAt: "2025-06-10T10:26:40Z",
                        isAuthor: false
                    },

                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "오늘 회의 때 뵙겠습니다.",
                        sentAt: "2025-06-10T10:27:05Z",
                        isAuthor: false
                    },
                    {
                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                        name: "허균",
                        message: "혹시 변경 사항 있으면 바로 알려주세요.",
                        sentAt: "2025-06-10T10:27:25Z",
                        isAuthor: false
                    }
                ]


module.exports = { FRIENDLIST_MOCK_DATA, MESSAGELIST_MOCK_DATA, CHATTING_INFO_MOCK_DATA ,CHATTING_MOCK_DATA };