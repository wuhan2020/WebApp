import { component, mixin, watch, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Field } from 'boot-cell/source/Form/Field';
import { Button } from 'boot-cell/source/Form/Button';

import { User } from '../service';
import { session } from '../model';

@observer
@component({
    tagName: 'session-box',
    renderTarget: 'children'
})
export class SessionBox extends mixin() {
    @watch
    countDown = 0;

    emitSignIn = (user: User) => this.emit('signin', user, {});

    connectedCallback() {
        super.connectedCallback();

        if (session.user) this.emitSignIn(session.user);
        else session.getProfile().then(this.emitSignIn);
    }

    handleSMSCode = () => {
        this.countDown = 60;

        const timer = setInterval(
                () => --this.countDown! || clearInterval(timer),
                1000
            ),
            { elements } = this.firstElementChild as HTMLFormElement;

        return session.sendSMSCode(
            (elements.namedItem('phone') as HTMLInputElement).value
        );
    };

    handleSignIn = (event: Event) => {
        event.preventDefault();

        const form = new FormData(event.target as HTMLFormElement);

        session
            .signIn(form.get('phone') as string, form.get('code') as string)
            .then(this.emitSignIn);
    };

    updatedCallback() {
        const Classes = ['d-flex', 'flex-column', 'justify-content-center'];

        if (session.user) this.classList.remove(...Classes);
        else this.classList.add(...Classes);
    }

    render() {
        const { countDown } = this;

        return session.user ? (
            this.defaultSlot
        ) : (
            <form
                className="mx-auto my-3 p-3 border rounded"
                style={{ maxWidth: '20rem' }}
                onSubmit={this.handleSignIn}
            >
                <h2 className="text-center mb-3">登录</h2>

                <InputGroup size="lg" className="mb-3">
                    <Field
                        type="tel"
                        name="phone"
                        maxLength="11"
                        required
                        placeholder="手机号"
                    />
                </InputGroup>

                <InputGroup size="lg" className="mb-3">
                    <Field
                        name="code"
                        required
                        placeholder="短信验证码"
                        autocomplete="off"
                    />
                    <Button
                        outline
                        color="secondary"
                        onClick={this.handleSMSCode}
                        disabled={!!countDown}
                    >
                        {countDown ? countDown + 's' : '获取'}
                    </Button>
                </InputGroup>

                <Button type="submit" block color="primary" size="lg">
                    登录
                </Button>
            </form>
        );
    }
}
