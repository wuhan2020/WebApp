import { WebCell, attribute, component, observer } from 'web-cell';
import { observable } from 'mobx';
import { InputGroup, FormControl, Button } from 'boot-cell';

import { User } from '../service';
import { session } from '../model';

export interface SessionBox extends WebCell {}

@component({
    tagName: 'session-box',
    mode: 'open'
})
@observer
export class SessionBox extends HTMLElement implements WebCell {
    @attribute
    @observable
    accessor countDown = 0;

    emitSignIn = (user: User) => this.emit('signin', user, {});

    mountedCallback() {
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

    renderForm() {
        const { countDown } = this;

        return (
            <form
                // @ts-ignore
                className="mx-auto my-3 p-3 border rounded"
                style={{ maxWidth: '20rem' }}
                onSubmit={this.handleSignIn}
            >
                <h2 className="text-center mb-3">登录</h2>

                <InputGroup size="lg" className="mb-3">
                    <FormControl
                        type="tel"
                        name="phone"
                        maxLength={11}
                        required
                        placeholder="手机号"
                    />
                </InputGroup>

                <InputGroup size="lg" className="mb-3">
                    <FormControl
                        name="code"
                        required
                        placeholder="短信验证码"
                        autocomplete="off"
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={this.handleSMSCode}
                        disabled={!!countDown}
                    >
                        {countDown ? countDown + 's' : '获取'}
                    </Button>
                </InputGroup>

                <Button
                    type="submit"
                    className="d-block w-100"
                    variant="primary"
                    size="lg"
                >
                    登录
                </Button>
            </form>
        );
    }

    render() {
        return (
            <>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                />
                {session.user ? <slot /> : this.renderForm()}
            </>
        );
    }
}
