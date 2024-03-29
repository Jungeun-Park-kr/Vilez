package kr.co.vilez.util

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import kr.co.vilez.ui.dialog.MyAlertDialog
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

class Common {

    companion object {

        const val DEFAULT_PROFILE_IMG = "https://kr.object.ncloudstorage.com/vilez/basicProfile.png"

        const val BOARD_TYPE_SHARE = 2
        const val BOARD_TYPE_ASK = 1

        const val SHARE_STATE_DEFAULT = 0 // 공유가능
        const val SHARE_STATE_SHARING = 1 // 공유중

        const val APPOINTMENT_TYPE_SHARE = 1 // 공유중인것
        const val APPOINTMENT_TYPE_RESERVE = 2 // 예약중인것

        const val APPOINTMENT_STATE_SHARE = 1 // 내가 공유자
        const val APPOINTMENT_STATE_ASK = 0 // 내가 피공유자


        fun showAlertDialog(context: AppCompatActivity, title:String, tag:String) {
            val dialog = MyAlertDialog(context, title)
            // 알림창이 띄워져있는 동안 배경 클릭 막기
            dialog.isCancelable = false
            dialog.show(context.supportFragmentManager, tag)
        }



        fun verifyPassword(password: String): Boolean {
            val regexPassword = Regex("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$"); // 비밀번호 정규식 : 8~16 (영어+숫자)
            return regexPassword.matches(password)
        }

        fun verifyEmail(email: String) : Boolean { // 이메일 정규식
            val regexEmail = """^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})${'$'}""".toRegex()
            return regexEmail.matches(email)
        }

        fun verifyNickname(nickname: String?): Boolean {
            val trimmedNickname = nickname?.trim().toString()
            val exp = Regex("^[가-힣ㄱ-ㅎa-zA-Z0-9]{2,6}\$")
            return !trimmedNickname.isNullOrEmpty() && exp.matches(trimmedNickname)
        }

        fun makeRandomPassword(id: String) :String {
            return "${getHash(id)}"
        }

        // SHA-256 해시함수
        fun getHash(str: String): String {
            var digest: String = ""
            digest = try {

                //암호화
                val sh = MessageDigest.getInstance("SHA-256") // SHA-256 해시함수를 사용
                sh.update(str.toByteArray()) // str의 문자열을 해싱하여 sh에 저장
                val byteData = sh.digest() // sh 객체의 다이제스트를 얻는다.


                //얻은 결과를 hex string으로 변환
                val hexChars = "0123456789abcdef"
                val hex = CharArray(byteData.size * 2)
                for (i in byteData.indices) {
                    val v = byteData[i].toInt() and 0xff
                    hex[i * 2] = hexChars[v shr 4]
                    hex[i * 2 + 1] = hexChars[v and 0xf]
                }

                String(hex) //최종 결과를 String 으로 변환

            } catch (e: NoSuchAlgorithmException) {
                e.printStackTrace()
                "" //오류 뜰경우 stirng은 blank값임
            }
            return digest
        }


        fun elapsedTime(date:String):String {
            val dateFormat = SimpleDateFormat("yyyy-MM-dd hh:mm:ss")
            val nowDate: LocalDateTime = LocalDateTime.now()
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss")
            val formatted = nowDate.format(formatter)

            val endDate = dateFormat.parse(formatted.toString()).time
            val startDate = dateFormat.parse(date).time

            val resultTime = (endDate - startDate) / 1000

            val arr = arrayOf(60*60*24*365, 60*60*24*30, 60*60*24, 60*60, 60)
            val date = arrayOf("년", "개월", "일", "시간", "분")
            for(i in 0..4){
                val time = (resultTime / arr[i]).toInt()

                if(time > 0){
                    return Integer.toString(time)+date[i]+"전"
                }
            }
            return "방금 전"
        }
        
        fun getBoardState(startDay: String):Int {
            val SDF = SimpleDateFormat ("yyyy-MM-dd")
            val calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"), Locale.KOREA)
            SDF.timeZone = TimeZone.getTimeZone("Asia/Seoul")
            SDF.calendar = calendar
            val today = SDF.format(Date(System.currentTimeMillis()))
            val todayDate = SDF.parse(today)
            val startDate = SDF.parse(startDay)
            var calcuDate = (startDate.time - todayDate.time) / (60 * 60 * 24 * 1000) //날짜 셋팅

            Log.d("test: 날짜!!", "$calcuDate 일 차이남!!")
            return if(calcuDate > 0) { // 예약한 것
                APPOINTMENT_TYPE_RESERVE
            } else { // 이미 공유중인것
                APPOINTMENT_TYPE_SHARE
            }
        }

        fun dateToMillis(day: String?):Long {
            val SDF = SimpleDateFormat ("yyyy-MM-dd")
            val calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"), Locale.KOREA)
            SDF.timeZone = TimeZone.getTimeZone("Asia/Seoul")
            SDF.calendar = calendar

            val startDate = SDF.parse(day)
            return startDate.time
        }

        fun dateToCalendar(day: String?):Calendar {
            val SDF = SimpleDateFormat ("yyyy-MM-dd")
            val calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"), Locale.KOREA)
            return if(!day.isNullOrEmpty()) {
                SDF.calendar = calendar
                Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"), Locale.KOREA)
                calendar.time = SDF.parse(day)
                calendar
            } else {
                calendar
            }

        }

    }
}