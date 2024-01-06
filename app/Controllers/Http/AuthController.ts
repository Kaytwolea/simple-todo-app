// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from "App/Models/User";

export default class AuthController {
  public showRegister({ view }) {
    return view.render('auth/register')
  }

  public async register({ request, auth, response }) {
    const validation = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(33),
        rules.unique({ table: 'users', column: 'email' })
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ])
    })

    const validated = await request.validate({
      schema: validation,
    })

    const user = await User.create(validated)

    await auth.login(user)

    return response.redirect('/')
  }

  public async logout({ auth, response }) {
    await auth.logout()

    return response.redirect('/')
  }

  public showLogin({ view }) {
    return view.render('auth/login')
  }

  public async login({ request, auth, session, response }) {
    const { email, password } = request.all()

    try {
      await auth.attempt(email, password)

      return response.redirect('/')
    } catch (err) {
      session.flash('notification', 'User not found')

      return response.redirect('back')
    }
  }
}
