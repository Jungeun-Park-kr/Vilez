package kr.co.vilez.data.dto

import kr.co.vilez.util.Common.Companion.APPOINTMENT_TYPE_SHARE

class BoardData (
    var boardId : Int,
    var roomId:Int?=0,
    var representImage: String,
    var title: String,
    var date: String,
    var hopePeriod:String,
    var bookmark:String,
    var boardWriterId: Int,
    var shareUserId:Int,
    var notShareUserId:Int,
    val type:Int, // 요청글 BOARD_TYPE_ASK(1), 공유글 BOARD_TYPE_SHARE(2)
    val state:Int?=APPOINTMENT_TYPE_SHARE, // 오늘이랑 비교해서 공유 중인지, 예약중인지 비교 (디폴트 : 공유중)
    val sDay:String?=null,
    val eDay:String?=null,
    val status:String?=null, // 시작일 임박!
) {
    override fun toString(): String {
        return "{ title: $title, roomId:$roomId, boardId:$boardId ,type:$type, state:$state, boardWriterId:$boardWriterId" +
                "state:$state sDay:$sDay, eDay:$eDay}"
    }
}