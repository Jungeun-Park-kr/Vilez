package kr.co.vilez.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.databinding.DataBindingUtil
import com.kakao.util.maps.helper.Utility
import kr.co.vilez.R
import kr.co.vilez.databinding.ActivityIntroBinding
import kr.co.vilez.ui.user.RegisterActivity

class IntroActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding:ActivityIntroBinding = DataBindingUtil.setContentView(this, R.layout.activity_intro)
        binding.activity = this
        supportActionBar?.hide() // 액션바 숨김

        var keyHash = Utility.getKeyHash(this)
        Log.d("빌리지", "onCreate: 카카오 key: $keyHash")

    }

    fun moveActivity(view: View) {
        when(view.id) {
            R.id.btn_intro_enter -> {
                val intent = Intent(this@IntroActivity, LoginActivity::class.java)
                startActivity(intent)
                finish()
            }
            R.id.tv_intro_register -> {
                startActivity(Intent(this@IntroActivity, RegisterActivity::class.java))
            }
        }

    }
}